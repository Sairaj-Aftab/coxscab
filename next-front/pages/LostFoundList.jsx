"use client";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import avatar from "@/public/no-image.jpg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/formatDateTime";
import { Calendar, ChevronLeft, ChevronRight, Eye, User } from "lucide-react";
import { useState } from "react";
import CoxsCabLoader from "@/components/CoxsCabLoader";
import Image from "next/image";

const fetcher = (url) => fetch(url).then((r) => r.json());

const LostFoundList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [reportType, setReportType] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedData, setSelectedData] = useState(null);

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_OBT_API}/lost-found?page=${page}&limit=${perPage}&reportType=${reportType}&search=${search}`,
    fetcher,
    { keepPreviousData: true }
  );

  const totalPages = Math.ceil(data?.count / perPage);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePerPageChange = (e) => {
    const newPerPage = Number(e.target.value);
    setPerPage(newPerPage);
    setPage(1); // Reset to first page when changing items per page
  };
  return (
    <div>
      <Card className="container mx-auto">
        <CardHeader className="px-3 pt-3 pb-0">
          <CardTitle className="text-primary">Lost and Found Items</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <Input
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-[300px]"
            />
            <Select
              value={reportType}
              onValueChange={(value) => setReportType(value)}
            >
              <SelectTrigger className="sm:max-w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Items</SelectItem>
                <SelectItem value="LOST">Lost Items</SelectItem>
                <SelectItem value="FOUND">Found Items</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">App. No.</TableHead>
                  <TableHead className="w-[60px]">View</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead className="min-w-[200px] max-w-[200px]">
                    Item
                  </TableHead>
                  <TableHead className="min-w-[200px] max-w-[200px]">
                    Location
                  </TableHead>
                  <TableHead className="min-w-[200px] max-w-[200px]">
                    Date
                  </TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-[200px] md:h-[300px]">
                      <CoxsCabLoader />
                    </TableCell>
                  </TableRow>
                ) : data?.reports?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center h-[200px] md:h-[300px] text-red-500 font-semibold text-sm"
                    >
                      No items found
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.reports?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.applicationNo}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedData(item);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 text-primary" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-bold ${
                            item.reportType === "LOST"
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {item.reportType}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Image
                          src={
                            item.imageUrls && item.imageUrls.length > 0
                              ? item.imageUrls[0]
                              : avatar
                          }
                          alt={item.goods}
                          width={100}
                          height={100}
                          priority
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold">
                            {item.goods.length > 20
                              ? `${item.goods.slice(0, 20)}...`
                              : item.goods}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.description.length > 20
                              ? `${item.description.slice(0, 20)}...`
                              : item.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{item.place}</TableCell>
                      <TableCell>{formatDateTime(item.dateTime)}</TableCell>
                      <TableCell>
                        <span
                          className={`font-bold text-sm ${
                            item.status === "pending"
                              ? "text-blue-600"
                              : "text-green-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden md:block">
                Rows per page:
              </span>
              <Select
                value={perPage.toString()}
                onValueChange={(value) =>
                  handlePerPageChange({ target: { value } })
                }
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder={perPage} />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{`${(page - 1) * perPage + 1}-${Math.min(
                page * perPage,
                data?.count
              )} of ${data?.count}`}</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <ChevronLeft className="h-4 w-4 -ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4 -ml-2" />
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-primary p-2 text-white text-sm font-normal text-center sm:text-start mt-4 rounded-b-lg">
            অনুসন্ধানের জন্য কল করুন : ‍
            <a
              href="tel:+8801320108710"
              className="text-yellow-300 text-base font-semibold"
            >
              01320-108710
            </a>
          </div>
        </CardContent>
      </Card>
      {selectedData && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[95vh] sm:max-w-5xl overflow-y-auto">
            <DialogHeader className="p-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold">
                  Item Details
                </DialogTitle>
                <Badge
                  variant={
                    selectedData.reportType === "LOST"
                      ? "destructive"
                      : "default"
                  }
                  className="text-sm"
                >
                  {selectedData.reportType}
                </Badge>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {/* Left column - Images */}
              <div className="space-y-2">
                <div className="rounded-lg h-[300px] w-full">
                  <Image
                    src={
                      selectedData.imageUrls &&
                      selectedData.imageUrls.length > 0
                        ? selectedData.imageUrls[0]
                        : avatar
                    }
                    alt={selectedData.goods || "Item image"}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    width={0}
                    height={0}
                    className="h-full w-auto object-contain mx-auto"
                  />
                </div>

                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{selectedData.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Details */}
              <div className="space-y-2">
                <div>
                  <h3 className="text-xl font-bold">{selectedData.goods}</h3>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDateTime(selectedData.dateTime)}</span>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">
                    {selectedData.description || "No description provided."}
                  </p>
                </div>

                {selectedData.place && (
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">
                      Location of{" "}
                      {selectedData.reportType === "LOST" ? "Lost" : "Found"}
                    </h4>
                    <p className="text-muted-foreground">
                      {selectedData.place}
                    </p>
                  </div>
                )}

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Application Number</h4>
                  <p className="text-muted-foreground">
                    #{selectedData.applicationNo}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LostFoundList;
