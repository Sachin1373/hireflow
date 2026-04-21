

export const downloadSampleCSV = () => {
    const csvContent =  `name,email,designation,password
John Doe,john@example.com,Senior Backend Engineer,Reviewer@123
Jane Smith,jane@example.com,Frontend Engineer,Reviewer@456`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "reviewer_sample.csv")

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link);
    URL.revokeObjectURL(url)
}

export const JobSteps = [
  { title: "Job Meta Data", description: "Define job role, title, and description" },
  { title: "Application Form", description: "Customize candidate application fields" },
  { title: "Reviewers", description: "Assign reviewers and hiring team" },
  { title: "Preview", description: "Review everything before publishing" },
];