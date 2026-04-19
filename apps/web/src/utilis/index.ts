

export const downloadSampleCSV = () => {
    const csvContent =  `name,email,designation
    John Doe,john@example.com,Senior Backend Engineer
    Jane Smith,jane@example.com,Frontend Engineer`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" })
    console.log('blob :', blob)
    const url = URL.createObjectURL(blob)
    console.log('url :', url)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "reviewer_sample.csv")

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link);
    URL.revokeObjectURL(url)
}