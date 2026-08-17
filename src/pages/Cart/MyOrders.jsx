import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  Eye,
  ShoppingBag,
} from "lucide-react";

import { getMyOrders } from "../../API/cosmicApis";

function StatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase();

  const statusConfig = {
    pending: {
      label: "Pending",
      className: "bg-amber-100 text-amber-700",
      icon: Clock3,
    },
    confirmed: {
      label: "Confirmed",
      className: "bg-blue-100 text-blue-700",
      icon: CheckCircle2,
    },
    processing: {
      label: "Processing",
      className: "bg-purple-100 text-purple-700",
      icon: Package,
    },
    shipped: {
      label: "Shipped",
      className: "bg-indigo-100 text-indigo-700",
      icon: Truck,
    },
    delivered: {
      label: "Delivered",
      className: "bg-emerald-100 text-emerald-700",
      icon: CheckCircle2,
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-red-100 text-red-700",
      icon: XCircle,
    },
  };

  const config = statusConfig[normalizedStatus] || {
    label: status || "Unknown",
    className: "bg-slate-100 text-slate-600",
    icon: Clock3,
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      <Icon size={13} />
      {config.label}
    </span>
  );
}


function OrderCard({ order, onViewDetails }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white border border-purple-100 shadow-md hover:shadow-xl transition-shadow overflow-hidden"
    >
      {/* Order Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-slate-400">Order ID</p>

          <p className="font-semibold text-slate-800 mt-0.5">
            #{order.orderNumber}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={order.orderStatus} />
        </div>
      </div>

      {/* Order Body */}
      <div className="p-6">
        <div className="space-y-4">
          {order.items?.map((item, index) => {
            const product = item.product;

            return (
              <div
                key={item._id || product?._id || index}
                className="flex items-center gap-4"
              >
                {/* Product Image */}
                <div className="h-20 w-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  {product?.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product?.name || "Product"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">
                    {product?.name || "Product"}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Quantity: {item.quantity}
                  </p>

                  {product?.salePrice !== undefined && (
                    <p className="text-xs text-slate-400 mt-1">
                      Price: ₹{item.price}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <p className="font-semibold text-slate-800">
                    ₹{item.subtotal}
                  </p>

                  {item.quantity > 1 && (
                    <p className="text-xs text-slate-400 mt-1">
                      ₹{item.price} × {item.quantity}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Info */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Order Date */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700">
              <Calendar size={17} />
            </div>

            <div>
              <p className="text-[11px] text-slate-400">Order Date</p>

              <p className="text-sm font-medium text-slate-700">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700">
              <CreditCard size={17} />
            </div>

            <div>
              <p className="text-[11px] text-slate-400">Payment</p>

              <p className="text-sm font-medium text-slate-700">
                {order.paymentStatus || "Pending"}
              </p>

              <p className="text-[11px] text-slate-400">
                {order.paymentMethod}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700">
              <Package size={17} />
            </div>

            <div>
              <p className="text-[11px] text-slate-400">Items</p>

              <p className="text-sm font-medium text-slate-700">
                {order.items?.reduce(
                  (total, item) => total + (item.quantity || 0),
                  0,
                )}{" "}
                {order.items?.reduce(
                  (total, item) => total + (item.quantity || 0),
                  0,
                ) === 1
                  ? "Item"
                  : "Items"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-400">Total Amount</p>

            <p className="text-xl font-bold text-purple-700">
              ₹{order.totalAmount}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onViewDetails(order)}
            className="flex items-center gap-2 rounded-xl bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 hover:bg-purple-800 transition-colors shadow"
          >
            <Eye size={16} />
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await getMyOrders();

      console.log("Fetched orders:", response.data);

      setOrders(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filters = [
    "All",
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter(
          (order) =>
            order.orderStatus?.toLowerCase() === activeFilter.toLowerCase(),
        );

  return (
    <div className="space-y-7 my-10 max-w-6xl mx-auto px-4">
      {/* Heading */}
      <div>
        <h1 className="text-center font-bold text-purple-700 text-5xl font-serif">
          My Orders
        </h1>

        <p className="text-center text-sm text-slate-500 mt-2">
          Track and manage all your orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              activeFilter === filter
                ? "bg-purple-700 text-white shadow"
                : "bg-white border border-purple-100 text-slate-600 hover:border-purple-300"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="rounded-2xl border border-purple-100 py-20 text-center">
          <div className="mx-auto h-10 w-10 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin" />

          <p className="text-sm text-slate-500 mt-4">Loading your orders...</p>
        </div>
      ) : filteredOrders.length > 0 ? (
        /* Orders */
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onViewDetails={setSelectedOrder}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-purple-200 py-20 text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-700">
            <Package size={26} />
          </div>

          <h3 className="mt-4 font-semibold text-slate-700">No orders found</h3>

          <p className="text-sm text-slate-400 mt-1">
            You don't have any{" "}
            {activeFilter !== "All" ? activeFilter.toLowerCase() : ""} orders
            yet.
          </p>
        </div>
      )}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white w-full hide max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Order Details</p>

                <h2 className="text-xl font-bold text-slate-800 mt-1">
                  #{selectedOrder.orderNumber}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={selectedOrder.orderStatus} />

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="h-9 w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Order Info */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400">Order Date</p>

                  <p className="font-semibold text-slate-700 mt-1">
                    {new Date(selectedOrder.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400">Payment</p>

                  <p className="font-semibold text-slate-700 mt-1">
                    {selectedOrder.paymentStatus}
                  </p>

                  <p className="text-xs text-slate-400">
                    {selectedOrder.paymentMethod}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400">Total Amount</p>

                  <p className="font-bold text-purple-700 text-lg mt-1">
                    ₹{selectedOrder.totalAmount}
                  </p>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">
                  Order Items
                </h3>

                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 border border-slate-100 rounded-xl p-4"
                    >
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        {item.product?.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <ShoppingBag size={20} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-700">
                          {item.product?.name}
                        </h4>

                        <p className="text-xs text-slate-400 mt-1">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-slate-700">
                        ₹{item.subtotal}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">
                  Delivery Address
                </h3>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="font-semibold text-slate-700">
                    {selectedOrder.address?.name}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {selectedOrder.address?.address}
                  </p>

                  <p className="text-sm text-slate-500">
                    {selectedOrder.address?.city},{" "}
                    {selectedOrder.address?.state} -{" "}
                    {selectedOrder.address?.pincode}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Mobile: {selectedOrder.address?.mobile}
                  </p>
                </div>
              </div>

              {/* Payment Details */}
              {selectedOrder.paymentDetails && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">
                    Payment Details
                  </h3>

                  <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Gateway</span>

                      <span className="font-medium text-slate-700">
                        {selectedOrder.paymentDetails?.paymentGateway}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Transaction ID</span>

                      <span className="font-medium text-slate-700">
                        {selectedOrder.paymentDetails?.transactionId}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Summary */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">
                  Price Summary
                </h3>

                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.subtotal}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Discount</span>
                    <span>₹{selectedOrder.discount}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>₹{selectedOrder.shippingCharge}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>GST</span>
                    <span>₹{selectedOrder.gst}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between">
                    <span className="font-bold">Total</span>

                    <span className="font-bold text-purple-700 text-lg">
                      ₹{selectedOrder.totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="font-semibold text-slate-800 mb-2">
                    Order Notes
                  </h3>

                  <p className="text-sm text-slate-500 bg-slate-50 rounded-xl p-4">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
