"use client"
import { useToast } from "@/hooks/use-toast"
import { ChevronDown, ChevronUp, Loader2, RotateCw, Search } from "lucide-react"
import { Document, Page, pdfjs } from "react-pdf"
import { useResizeDetector } from "react-resize-detector"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`

import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { useState } from "react"
import { useForm } from "react-hook-form"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import SimpleBar from "simplebar-react"
import { z } from "zod"
import PdfFullscreen from "./PdfFullscreen"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu"
import { Input } from "./ui/input"

// tror det er noe feil med denne som gjør at jeg får error når jeg prøver å laste pdfen inn...
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs"

interface PdfRendererProps {
  url: string
}

const PdfRenderer = ({ url }: PdfRendererProps) => {
  const { toast } = useToast()
  const [numPages, setNumPages] = useState<number>()
  const [currPage, setCurrPage] = useState<number>(1)
  const [scale, setScale] = useState<number>(1)
  const [rotation, setRotation] = useState<number>(0)
  const [renderedScale, setRenderedScale] = useState<number | null>(null)
  const isLoaing = renderedScale !== scale

  const CustomPageValidator = z.object({
    page: z.string().refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  })
  type TCustomPageValidator = z.infer<typeof CustomPageValidator>

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  })
  const { width, ref } = useResizeDetector()
  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrPage(Number(page))
    setValue("page", String(page))
  }

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={currPage <= 1}
            onClick={() => {
              setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1))
              setValue("page", String(currPage - 1))
            }}
            variant="ghost"
            aria-label="previous page"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              className={cn("w-12 h-8", errors.page && "focus-visible:ring-red-500")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)()
                }
              }}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numPages ?? "x"}</span>
            </p>
          </div>

          <Button
            disabled={currPage === numPages! || numPages === undefined}
            onClick={() => {
              setCurrPage((prev) => (prev + 1 > numPages! ? numPages! : prev + 1))
              setValue("page", String(currPage + 1))
            }}
            variant="ghost"
            aria-label="next page"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="zoom" variant="ghost" className="gap-1.5">
                <Search className="h-4 w-4" />
                {scale * 100}% <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>100%</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>150%</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>200%</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>250%</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setRotation((prev) => prev + 90)} variant="ghost" aria-label="rotate 90 degrees">
            <RotateCw className="h-4 w-4" />
          </Button>
          <PdfFullscreen fileUrl={url} />
        </div>
      </div>
      <div className="flex-1  w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
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
              file={url}
              className="max-w-full"
            >
              {isLoaing && renderedScale ? (
                <Page
                  pageNumber={currPage}
                  width={width ? width : 1}
                  scale={scale}
                  rotate={rotation}
                  key={"@" + renderedScale}
                />
              ) : null}
              <Page
                className={cn(isLoaing ? "hidden" : "")}
                pageNumber={currPage}
                width={width ? width : 1}
                scale={scale}
                rotate={rotation}
                key={"@" + scale}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className=" my-24 w-6 h-6 animate-spin" />
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(scale)} // set rendered scale to current scale
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  )
}
export default PdfRenderer
