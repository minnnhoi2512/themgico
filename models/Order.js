class Order {
    constructor(
        orderId,
        tableId,
        orderDate,
        status,
        mode,
        numberguest,
        total
    ) {
        this.orderId = orderId;
        this.tableId = tableId;
        this.orderDate = orderDate;
        this.mode = mode;
        this.numberguest = numberguest;
        this.status = status;
        this.total = total;
    }
}
module.exports = Order;
