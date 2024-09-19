function generatePDF() {
    console.log('generate PDF function called');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont("helvetica");

    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // First Page: Title, Score, Identifier, and Feedback Box
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Testimonial Readiness Assessment - Physicians (TRA-P)", 20,10);
    //   doc.setFont("helvetica", "bold");
     doc.setFontSize(16);
     doc.text("Data Output and Assessment Scores", 10, 30);

 
    const Identifier = document.getElementById("identifier").value;
   const rater = document.getElementById("Rater").value; // Retrieve the value of the Rater input
doc.setFontSize(16);
doc.setTextColor(0, 0, 0);
doc.text(`Rater Name or Identifier: ${rater}`, 10,56); // Add the Rater value into the PDF

    // Get today's date dynamically
   
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
        doc.setFontSize(16);
    doc.text(`Provider Name or Identifier: ${Identifier}`, 10, 47);
        doc.setFontSize(16);
    doc.text(`Assessment Date: ${formattedDate}`, 10, 38);
   doc.setFontSize(16); // Set the font size
doc.setTextColor(0, 48, 143); // Set the text color
doc.text("Testimonial Readiness Assessment Score:", 11, 67); // Add the text


const scoreString = document.getElementById("score").innerText;
let score = scoreString.split('is')[1];
 const padding =30
// Define the position and dimensions of the rounded box
const x = 8;
const y = 60;
const width = 180; // Adjust width as needed
const height = 20+padding; // Adjust height as needed
const radius = 5; // Radius of the rounded corners


doc.setDrawColor(0, 48, 143); // Facebook blue border
doc.setLineWidth(0.9); // Border thickness

// Draw the rounded rectangle
doc.roundedRect(x, y, width, height, radius, radius,'D'); // Fill and draw


// Add the text inside the rounded rectangle
 doc.setFontSize(13);
 doc.setTextColor(0, 48, 143)
doc.text("Your provider's overall testimonial readiness score is:", x + 5, y + 45); // Adjust text position as needed

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 0, 0);
    doc.text(` ${score}`, 130, 105);
    doc.getTextWidth(score);
    // Draw the underline

doc.setTextColor(0, 0, 0);
doc.setFontSize(25)
doc.setTextColor(0, 45, 98)
doc.text(" out of 10", 145, 105);
// doc.setDrawColor(200, 0, 0); // Set the underline color (black or any color you want)
// doc.line(130, 107,130 + scoreWidth, 107); // Draw the underline (y + 2 for offset)
    
    doc.setFontSize(18);
    doc.text("Strengths and Weaknesses:", 11, 133);


    // Top Strengths section
// Font size for Top Strengths title
// Top Strengths Section
doc.setFontSize(14); // Font size for Top Strengths title
const topStrengthsTitle = 'Top Strengths (highest two scores):';
const topStrengthsY = 150; // Y position for Top Strengths title
doc.text(topStrengthsTitle, 10, topStrengthsY); // Draw the title

// Print strengths (adjust margin between title and content)
const strengths = document.getElementById("strengths").innerText.split('\n');
doc.setFontSize(12); // Font size for strength items
let strengthsYPosition = topStrengthsY + 10; // Initial position for strengths content

// Loop through each strength and add it to the PDF
strengths.forEach(strength => {
    doc.text(strength, 10, strengthsYPosition);
    strengthsYPosition += 6; // Fixed spacing between lines, adjust as needed
});

// Main Weaknesses Section
doc.setFontSize(14); // Font size for Main Weaknesses title
const mainWeaknessesTitle = 'Main Weaknesses (bottom two scores):';
// Set the Y position for Main Weaknesses title
const weaknessesTitleY = strengthsYPosition + 10; // Minimal space after strengths content
doc.text(mainWeaknessesTitle, 10, weaknessesTitleY); // Draw the Main Weaknesses title

// Print weaknesses (with minimal space between heading and descriptions)
const weaknesses = document.getElementById("weaknesses").innerText.split('\n');
doc.setFontSize(12); // Font size for weakness items
let weaknessesYPosition = weaknessesTitleY + 10; // Initial position for weaknesses content

// Loop through each weakness and add it to the PDF
weaknesses.forEach(weakness => {
    doc.text(weakness, 10, weaknessesYPosition);
    weaknessesYPosition += 6; // Fixed spacing between lines, adjust as needed
});
const boxPadding = 10; // Padding around the content

// Adjust box width and X position to decrease width from the right
const decreaseAmount = 3; // Amount to decrease the width by
const boxX = 5 + decreaseAmount; // Shift X position to the right
const boxWidth = 188 - decreaseAmount; // Decrease the width of the box

// Increase the box height towards the top
const boxY = topStrengthsY - 25; // Y position for the box
const boxHeight = weaknessesYPosition - topStrengthsY + boxPadding * 3; // Height to cover the entire content

const boxRadius = 5; // Radius of the rounded corners

doc.setDrawColor(0, 48, 143); // Blue border color
doc.setLineWidth(0.9); // Border thickness
doc.roundedRect(boxX, boxY, boxWidth, boxHeight, boxRadius, boxRadius, 'D'); // Draw rounded rectangle

    //  Feedback Box

        // Bar Chart Section
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Sub-scale-scores (-100 to +100):", 10, 218);
        const textBarWidth = doc.getTextWidth("Sub-scale-scores (-100 to +100):");
        doc.setLineWidth(0.5);
        doc.setFont("helvetica");
// 
        // Capture the Bar Chart
        html2canvas(document.querySelector("#chartContainer"), { scale: 1.5 }).then(canvas => {
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            const thresholdHeight = 350; // Increased crop height
            let yPosition = 220; // Start position for the bar chart on the first page
            let remainingHeight = imgHeight;
            let startCropY = 0; // Initial start point for cropping

            // Function to crop and add image to PDF
            const addImageToPDF = (startY, height, yPos, scale = 5) => {
                if (height <= 0) return; // No more content to add

                const croppedCanvas = document.createElement('canvas');
                const croppedCtx = croppedCanvas.getContext('2d');

                croppedCanvas.width = imgWidth;
                croppedCanvas.height = height;

                croppedCtx.drawImage(canvas, 0, startY, imgWidth, height, 0, 0, imgWidth, height);
                const croppedImgData = croppedCanvas.toDataURL("image/png",0.7);

                // Calculate dimensions to fit the page width
                const imgWidthScaled = pageWidth - 2 * margin;
                const imgHeightScaled = height * (imgWidthScaled / imgWidth) * scale; // Maintain aspect ratio

                doc.addImage(croppedImgData, 'PNG', margin, yPos, imgWidthScaled, imgHeightScaled);
            };
    // Add the first part of the bar chart to the first page
            const heightToPrint = Math.min(thresholdHeight, remainingHeight);
            addImageToPDF(startCropY, heightToPrint, yPosition, 1.2); // Keep to 1x scale for the first page
            yPosition += heightToPrint;
            remainingHeight -= heightToPrint;
            startCropY += heightToPrint; // Update crop start for the next page
// 
        
            // Add a new page if needed and start the remaining image
            if (remainingHeight > 0) {
                doc.addPage();
                doc.setFontSize(18);
                doc.setFont("helvetica", "bold");
                 doc.setTextColor(0, 0, 0);
                doc.text("Testimonial Readiness Assessment - Physicians (TRA-P)", 20, 17);
                doc.setFontSize(14);
                const Identifier = document.getElementById("identifier").value;
                     doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
        doc.text(`Provider Name or Identifier: ${Identifier}`, 10, 40);
        const scoreString = document.getElementById("score").innerText;
        let score = scoreString.split('is')[1];
     doc.setFontSize(16);
     doc.setTextColor(0, 0, 0);
     doc.text("Your provider's overall testimonial readiness score is:", 10, 60);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 0, 0);
    doc.text(`${score}`, 155, 60);
  doc.setTextColor(0, 48, 143); // Blue border color
    doc.text(" out of 10", 167, 60);
    // Get today's date 
       const rater = document.getElementById("Rater").value; // Retrieve the value of the Rater input
doc.setFontSize(16);
doc.setTextColor(0, 0, 0);
doc.text(`Rater Name or Identifier: ${rater}`, 10,50); // Add the Rater value into the PDF
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    
    doc.text(`Assessment Date: ${formattedDate}`, 10, 30);
                doc.setFont("helvetica", "bold");
                doc.text("Sub-scale-continues:", 10, 68);
                // doc.setLineWidth(0.5);
                // doc.line(10, 62, 10 + doc.getTextWidth("Sub-scale-continues:"), 62);

                yPosition = 70; // Reset Y position for the new page

                // Add the remaining part of the bar chart image with reduced scale to avoid crossing page text
                const addRemainingImage = (startY, yPos) => {
                    const heightToPrint = imgHeight - startY; // Remaining height to the end of the image
                    addImageToPDF(startY, heightToPrint, yPos, 1.3); // Scale slightly smaller for the second page
                };

                addRemainingImage(startCropY, yPosition);
                remainingHeight = 0; // All remaining image has been added
            }

            // Add Third Page: Questions and Answers
     doc.addPage();
doc.setFontSize(18);
doc.setFont("helvetica", "bold");

const title = "Testimonial Readiness Assessment - Physicians (TRA-P)";
const subtitle = "Questions Answers";
const titleWidth = doc.getTextWidth(title);
const subtitleWidth = doc.getTextWidth(subtitle);

// Center Title
const titleYPosition = 9;  // Adjust this to move the title higher
doc.text(title, (pageWidth - titleWidth) / 2, titleYPosition);

doc.setFontSize(14);
doc.setFont("helvetica", "bold");

// Center Subtitle
const subtitleYPosition = 18;  // Adjust this to move the subtitle higher or lower
doc.text(subtitle, (pageWidth - subtitleWidth) / 2, subtitleYPosition);


            // Capture and Add Image from assessmentForm
            html2canvas(document.querySelector("#assessmentForm"),{ scale: 1.5 }).then(canvas => {
                const imgData = canvas.toDataURL("image/png");
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;

                let yPosition = 23; // Start position for assessment form on third page
                let remainingHeight = imgHeight;
                let startCropY = 0; // Initial start point for cropping

                // Function to crop and add image to PDF
                const addImageToPDF = (startY, height,scale = 1.4) => {
                    if (height <= 0) return; // No more content to add

                    const croppedCanvas = document.createElement('canvas');
                    croppedCanvas.width = imgWidth;
                    croppedCanvas.height = height;

                    const ctx = croppedCanvas.getContext('2d');
                    ctx.drawImage(canvas, 0, startY, imgWidth, height, 0, 0, imgWidth, height);
                    const croppedImgData = croppedCanvas.toDataURL("image/png",0.7);
                    
                    // Calculate dimensions to fit the page width
                    const formImgWidth = pageWidth - 2 * margin;
                    const formImgHeight = height * (formImgWidth / imgWidth) * scale; // Scale height to 80%

                    doc.addImage(croppedImgData, 'PNG', margin, yPosition, formImgWidth, formImgHeight);
                    yPosition += formImgHeight; // Update Y position for the next part
                };

                // Add the first part of the assessment form image to the page
                const thresholdHeight = 1810; // Increased crop height
                const heightToPrint = Math.min(thresholdHeight, remainingHeight);
                addImageToPDF(startCropY, heightToPrint);
                yPosition += heightToPrint;
                remainingHeight -= heightToPrint;
                startCropY += heightToPrint; // Update crop start for the next page

                // Add a new page if needed and start the remaining image
                if (remainingHeight > 0) {
                    doc.addPage();
                    yPosition = 10; // Reset Y position for the new page

                    // Add the remaining part of the assessment form image
                    addImageToPDF(startCropY, remainingHeight);
                    remainingHeight = 0; // All remaining image has been added
                }

                doc.save("assessment.pdf");
            });
        });
    
}

export{
    generatePDF
}
