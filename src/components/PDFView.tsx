interface PDFViewProps {
  pdfUrl: string;
}
export default function PDFView(props: PDFViewProps) {
  if (!props.pdfUrl) {
    return (
      <div>Click to on an chat</div>
    );
  }
  return (
    <iframe
      src={props.pdfUrl}
      class="w-full h-full"
    >
    </iframe>
  );
}
