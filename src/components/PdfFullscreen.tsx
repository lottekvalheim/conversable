import { useToast } from "@/hooks/use-toast"
import { ExpandIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import { Document, Page } from "react-pdf"
import { useResizeDetector } from "react-resize-detector"
import SimpleBar from "simplebar-react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"

interface PdfFullscreenProps {
  fileUrl: string
}

const PdfFullscreen = ({ fileUrl }: PdfFullscreenProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [numPages, setNumPages] = useState<number>()

  const { width, ref } = useResizeDetector()

  const { toast } = useToast()

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(false)
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button variant="ghost" className="gap-1.5" aria-label="Fullscreen">
          <ExpandIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <SimpleBar autoHide={false} className="max-h-[calc-100vh-10rem] mt-6">
          {/* PDF content */}
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className=" my-24 w-6 h-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                toast({
                  title: "Error loading PDF",
                  description: "Please try again later",
                  variant: "destructive",
                })
              }}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              file={fileUrl}
              className="max-w-full"
            >
              {new Array(numPages).fill(0).map((_, i) => (
                <Page key={i} pageNumber={i + 1} width={width ? width : 1} />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  )
}
export default PdfFullscreen
