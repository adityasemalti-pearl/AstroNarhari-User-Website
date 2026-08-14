import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radio, 
  Eye, 
  Star, 
  Play, 
  Plus, 
  Sparkles, 
  Search, 
  X, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff 
} from 'lucide-react';
import { getActiveSessions, joinAgoraSession } from '../../API/agoraApi';
import AgoraRTC from 'agora-rtc-sdk-ng';

export default function LiveStream() {
  const [activeCategory, setActiveCategory] = useState('All Live');
  const [streams, setStreams] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(false);

  const [joinedStream, setJoinedStream] = useState(null);
  const [agoraClient, setAgoraClient] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const categories = [
    'All Live', 
    'Vedic Astrology', 
    'Tarot Reading', 
    'Numerology', 
    'Palmistry', 
    'Manifestation',
    'Love & Marriage',
    'Health',
    'Love',
    'Property'
  ];

  useEffect(() => {
    const fetchActiveSessions = async () => {
      setLoading(true);
      try {
        const categoryParam = activeCategory === 'All Live' ? undefined : activeCategory;
        const response = await getActiveSessions(categoryParam);
        
        if (response.data && response.data.success) {
          setStreams(response.data.sessions || []);
          setTotalSessions(response.data.total || 0);
        }
      } catch (error) {
        console.error('Error fetching active sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveSessions();
  }, [activeCategory]);

  const handleJoinStream = async (stream) => {
    try {
      const payload = {
        sessionId: stream._id,
        userId: "6a60638240b5df06fa258b16"
      };

      const res = await joinAgoraSession(payload);
      
      if (res.data) {
        setJoinedStream({
          ...stream,
          ...res.data
        });

        const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
        await client.setClientRole("audience");
        setAgoraClient(client);

        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "video") {
            setRemoteUsers(prev => [...prev, user]);
            setTimeout(() => {
              if (remoteVideoRef.current) {
                user.videoTrack.play(remoteVideoRef.current);
              }
            }, 200);
          }
          if (mediaType === "audio") {
            user.audioTrack.play();
          }
        });

        client.on("user-unpublished", (user, mediaType) => {
          if (mediaType === "video") {
            setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
          }
        });

        const appId = res.data.appId || "0228c9fe15a54e20a48e44835be49d7c";
        const channelName = stream.channelName || res.data.channelName;
        const token = res.data.token || null;
        const uid = res.data.uid || null;

        await client.join(appId, channelName, token, uid);
      }
    } catch (error) {
      console.error("Error joining stream:", error);
    }
  };

  const handleLeaveStream = async () => {
    if (agoraClient) {
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }
      await agoraClient.leave();
    }
    setJoinedStream(null);
    setAgoraClient(null);
    setRemoteUsers([]);
  };

  const toggleAudio = async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(!isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  const topChoice = streams.length > 0 ? {
    id: streams[0]._id,
    rawData: streams[0],
    name: streams[0].partnerId?.fullName || 'Cosmic Expert',
    specialty: streams[0].topic || 'Interactive Cosmic Session',
    viewers: streams[0].viewerCount || 0,
    rating: streams[0].partnerId?.averageRating || '5.0',
    category: streams[0].category,
    image: streams[0].partnerId?.profilePic || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200',
    avatar: streams[0].partnerId?.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  } : null;

  const liveStreamsList = streams.length > 1 ? streams.slice(1) : [];

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 font-sans relative flex flex-col justify-between pb-20">
      
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <header className="w-full bg-white/85 backdrop-blur-md border-b border-purple-100/80 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-600/20">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="font-serif tracking-widest text-xl font-bold text-indigo-950 uppercase">
                Live Now
              </h1>
              <p className="text-[11px] text-amber-700 font-semibold tracking-wide">
                Interactive Cosmic Sessions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-slate-100/80 border border-slate-200/80 rounded-2xl px-4 py-2 text-xs text-slate-600">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search astrologers or topics..." 
                className="bg-transparent outline-none w-48 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{totalSessions} Active Sessions</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 w-full relative z-10 flex-1 space-y-10">
        
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-950 to-indigo-900 text-amber-300 shadow-lg shadow-purple-950/20 scale-105'
                    : 'bg-white/80 text-slate-600 hover:bg-white border border-purple-100/80 shadow-sm'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-purple-950 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : streams.length === 0 ? (
          <div className="text-center py-20 bg-white/60 rounded-3xl border border-purple-100/80">
            <p className="text-slate-500 text-sm font-medium">No live streams available for this category.</p>
          </div>
        ) : (
          <>
            {topChoice && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h2 className="font-serif text-2xl font-bold text-indigo-950">
                      Top Choice
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-purple-900 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                    Featured Streamer
                  </span>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative w-full h-[380px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-purple-100/80 group cursor-pointer"
                >
                  <img 
                    src={topChoice.image} 
                    alt={topChoice.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        LIVE
                      </span>
                      <span className="bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                        <Eye className="w-3.5 h-3.5 text-amber-300" />
                        {topChoice.viewers} Viewing
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg">
                      <Star className="w-5 h-5 fill-slate-950" />
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2 text-white max-w-xl">
                      <h3 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
                        {topChoice.name}
                      </h3>
                      <p className="text-sm text-slate-200 font-normal">
                        {topChoice.specialty}
                      </p>
                    </div>

                    <motion.button 
                      onClick={() => handleJoinStream(topChoice.rawData)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-bold text-sm rounded-2xl shadow-xl flex items-center gap-2 self-start md:self-auto"
                    >
                      <Play className="w-4 h-4 fill-indigo-950" />
                      <span>Join Stream</span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            )}

            {liveStreamsList.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-purple-100/80 pb-4">
                  <h2 className="font-serif text-2xl font-bold text-indigo-950">
                    Currently Streaming
                  </h2>
                  <span className="text-xs font-medium text-slate-500">
                    Showing active broadcasts
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {liveStreamsList.map((stream, idx) => {
                    const partnerName = stream.partnerId?.fullName || 'Astrologer';
                    const partnerPic = stream.partnerId?.profilePic || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800';
                    const rating = stream.partnerId?.averageRating || '4.8';

                    return (
                      <motion.div
                        key={stream._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-purple-100/80 shadow-lg shadow-purple-950/5 hover:shadow-xl hover:border-purple-200 transition-all group flex flex-col justify-between"
                      >
                        <div className="relative h-48 w-full overflow-hidden">
                          <img 
                            src={partnerPic} 
                            alt={partnerName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          
                          <div className="absolute top-3 left-3 flex items-center gap-2">
                            <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-sm">
                              LIVE
                            </span>
                            <span className="bg-slate-950/60 backdrop-blur-md text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Eye className="w-3 h-3 text-amber-300" />
                              {stream.viewerCount || 0}
                            </span>
                          </div>

                          <div 
                            onClick={() => handleJoinStream(stream)}
                            className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-full bg-purple-900/90 text-amber-300 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                              <Play className="w-5 h-5 fill-amber-300 ml-0.5" />
                            </div>
                          </div>
                        </div>

                        <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                          <div className="flex items-center gap-3">
                            <img 
                              src={partnerPic} 
                              alt={partnerName}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100"
                            />
                            <div className="overflow-hidden">
                              <h4 className="font-serif text-base font-bold text-indigo-950 truncate">
                                {partnerName}
                              </h4>
                              <p className="text-xs text-slate-500 truncate">
                                {stream.topic || 'Cosmic Guidance'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-[11px] font-semibold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 truncate max-w-[120px]">
                              {stream.category}
                            </span>

                            <div className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span>{rating}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

      </main>

      <AnimatePresence>
        {joinedStream && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-lg flex items-center justify-center p-4 md:p-8"
          >
            <div className="relative w-full max-w-5xl h-[80vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-purple-500/30 flex flex-col">
              
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                  <span className="text-sm font-semibold">{joinedStream.topic || 'Live Session'}</span>
                </div>

                <button 
                  onClick={handleLeaveStream}
                  className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg hover:bg-rose-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 relative w-full h-full bg-slate-950 flex items-center justify-center">
                <div ref={remoteVideoRef} className="w-full h-full absolute inset-0 object-cover" />
                
                {remoteUsers.length === 0 && (
                  <div className="text-center space-y-3 z-15">
                    <div className="w-16 h-16 rounded-full bg-purple-900/50 text-amber-300 flex items-center justify-center mx-auto animate-pulse border border-purple-500/30">
                      <Radio className="w-8 h-8" />
                    </div>
                    <p className="text-slate-300 text-sm font-medium">Connecting to stream...</p>
                  </div>
                )}
              </div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                <button 
                  onClick={toggleAudio}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${isMuted ? 'bg-rose-600' : 'bg-slate-800 hover:bg-slate-700'}`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button 
                  onClick={toggleVideo}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${isVideoOff ? 'bg-rose-600' : 'bg-slate-800 hover:bg-slate-700'}`}
                >
                  {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>

                <button 
                  onClick={handleLeaveStream}
                  className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition-colors"
                >
                  Leave Stream
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/40 border-2 border-white ring-4 ring-amber-400/20 group"
          title="Go Live / Schedule Session"
        >
          <Plus className="w-8 h-8 text-slate-950 stroke-[2.5]" />
        </motion.button>
      </motion.div>

      <footer className="w-full text-center py-6 border-t border-slate-200/60 text-xs text-slate-400 bg-white/40">
        &copy; {new Date().getFullYear()} Live Astro Network. All spiritual sessions are end-to-end encrypted.
      </footer>

    </div>
  );
}