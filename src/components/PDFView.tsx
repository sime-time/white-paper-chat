interface PDFViewProps {
  pdfUrl: string;
}
export default function PDFView(props: PDFViewProps) {
  return (
    <iframe
      src={props.pdfUrl}
      class="w-full h-full"
    >
    </iframe>
  );
}
