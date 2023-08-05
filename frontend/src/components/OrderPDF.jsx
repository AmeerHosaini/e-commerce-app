import jsPDF from "jspdf";
import { Button } from "react-bootstrap";

const OrderPDFReport = ({ orders }) => {
  const handlePrintPDF = () => {
    const doc = new jsPDF();

    // Set the font size and position for each line
    const lineHeight = 10;
    let verticalOffset = 20;

    orders?.forEach((order, index) => {
      doc.text(`Order ID: ${order._id}`, 10, verticalOffset);
      verticalOffset += lineHeight;
      doc.text(`User: ${order.user && order.user.name}`, 10, verticalOffset);
      verticalOffset += lineHeight;
      doc.text(`Date: ${order.createdAt.substring(0, 10)}`, 10, verticalOffset);
      verticalOffset += lineHeight;
      doc.text(`Total: $${order.totalPrice}`, 10, verticalOffset);
      verticalOffset += lineHeight;
      doc.text(
        `Paid: ${order.isPaid ? order.paidAt.substring(0, 10) : "Not Paid"}`,
        10,
        verticalOffset
      );
      verticalOffset += lineHeight;
      doc.text(
        `Delivered: ${
          order.isDelivered
            ? order.deliveredAt.substring(0, 10)
            : "Not Delivered"
        }`,
        10,
        verticalOffset
      );
      verticalOffset += lineHeight * 2; // Add extra space between orders
    });

    // Generate the PDF as a Blob URI
    const blobUri = doc.output("bloburi");

    // Create a temporary link and trigger a click to download the PDF
    const link = document.createElement("a");
    link.href = blobUri;
    link.download = "order_report.pdf";
    link.click();

    // Remove the temporary link
    URL.revokeObjectURL(blobUri);
  };

  return (
    <>
      <Button variant="info" onClick={handlePrintPDF}>
        Generate PDF
      </Button>
    </>
  );
};

export default OrderPDFReport;
