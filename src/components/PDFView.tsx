interface PDFViewProps {
  pdfUrl: string;
}
export default function PDFView(props: PDFViewProps) {
  console.log("pdfUrl:", props.pdfUrl);
  return (
    <iframe
      src={props.pdfUrl}
      class="w-full h-full"
    >
    </iframe>
  );
}
