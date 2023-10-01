export enum TransactionStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
  EXPIRED = "expired",
}

export enum TransactionType {
  CUSTOMER_PAY = "customer_pay",
  CUSTOMER_REFUND = "customer_refund",
  INSTRUCTOR_PAY = "instructor_pay",
}
