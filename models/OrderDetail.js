class OrderDetail {
    constructor(
        orderDetailId,
        orderId,
        productId,
        quantity,
        status,
        orderTime
    ) {
        this.orderDetailId = orderDetailId;
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.status = status;
        this.orderTime = orderTime;
    }
}
module.exports = OrderDetail;
