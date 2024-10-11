function generatePDF() {
    console.log('generate PDF function called');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont("helvetica");
//
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // First Page: Title, Score, Identifier, and Feedback Box
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Testimonial Readiness Assessment Score", 37,10);
    //   doc.setFont("helvetica", "bold");
     doc.setFontSize(11);
     doc.text("Data Output and Assessment Scores", 10, 30);

    const Identifier = document.getElementById("identifier").value;
   const rater = document.getElementById("Rater").value; // Retrieve the value of the Rater input
  doc.setFontSize(11);
doc.setTextColor(0, 0, 0);
const offset1 = 10;  // Position offset for the text
const textY = 56;  // Y position for the text
const underlineY1 = textY + 1; // Y position for the underline, slightly below the text

// Add the text
doc.text(`Rater Name / Identifier :`, offset1, textY);

const staticTextWidth = doc.getTextWidth('Rater Name / Identifier:');
const raterX = 17 + staticTextWidth
doc.text(`${rater}`, raterX, textY);
// Calculate the width of the text
 doc.getTextWidth(`Rater Name or Identifier : ${rater}`);
doc.setLineWidth(0.5);
// Set the underline start and end positions based on the text width
const underlineStartX = offset1 +  48;
const underlineEndX = underlineStartX + 30;  // Extend the underline by 12 units after the text

// Set the color for the underline
doc.setDrawColor(0, 0, 0);

// Draw the underline after the text
doc.line(underlineStartX, underlineY1, underlineEndX, underlineY1);

    // Get today's date dynamically
   
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    doc.setFontSize(11);
    // doc.text(`Provider Name or Identifier: ${Identifier}`, 10, 47);
    const offset2 = 10;  // Position offset for the text
const textY2 = 47;  // Y position for the text
const underlineY2 = 48 ; // Y position for the underline, slightly below the text

// Add the text
doc.text(`Provider Name / Identifier: ${Identifier}`, offset2, textY2);
// Calculate the width of the text
const textWidth2 = doc.getTextWidth(`Provider Name / Identifier: ${Identifier}`);
doc.setLineWidth(0.5);
// Set the underline start and end positions based on the text width
const underlineStartX2 = offset2 + 48;
const underlineEndX2 = underlineStartX2 + 30;  // Extend the underline by 12 units after the text

// Set the color for the underline
doc.setDrawColor(0, 0, 0);

// Draw the underline after the text
doc.line(underlineStartX2, underlineY2, underlineEndX2, underlineY2);
        doc.setFontSize(11);
    doc.text(`Assessment Date: ${formattedDate}`, 10, 38);
   doc.setFontSize(16); // Set the font size
doc.setTextColor(0, 48, 143); // Set the text color
doc.text("Testimonial Readiness Assessment Score:", 12, 87); // Add the text


const scoreString = document.getElementById("score").innerText;
let score = scoreString.split('is')[1];
 const padding =9
// Define the position and dimensions of the rounded box
const x = 9;
const y = 80;
const width = 187; // Adjust width as needed
const height = 20+padding; // Adjust height as needed
const radius = 5; // Radius of the rounded corners


doc.setDrawColor(0, 48, 143); // Facebook blue border
doc.setLineWidth(0.9); // Border thickness

// Draw the rounded rectangle
doc.roundedRect(x, y, width, height, radius, radius,'D'); // Fill and draw


// Add the text inside the rounded rectangle
 doc.setFontSize(14);
 doc.setTextColor(0, 48, 143)
doc.text("Your provider's overall testimonial readiness score is:", x + 5, y + 24); // Adjust text position as needed

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(200, 0, 0);
    doc.text(` ${score}`, 141, 104);
    doc.getTextWidth(score);
    // Draw the underline
    const textWidth = doc.getTextWidth(score);

// Add an underline
// add something new  h
const offset =14;
const underlineY = 106; // Adjust the Y position for the underline
 doc.setDrawColor(200, 0, 0);
doc.line(130 +offset , underlineY, 130 + textWidth+12, underlineY);

doc.setFontSize(14);
 doc.setTextColor(0, 48, 143)
doc.text(" out of", 152, 104);

doc.setTextColor(200, 0, 0);  // Red color (RGB)
doc.setFontSize(14);
// Write "10" after the "out of"
doc.text("10", doc.getTextWidth("out of ") + 154, 104);
// doc.setDrawColor(200, 0, 0); // Set the underline color (black or any color you want)
// doc.setFontSize(13);
//  doc.setDrawColor(200, 0, 0);
// doc.text("10", 150, 105);
// doc.line(130, 107,130 + scoreWidth, 107); // Draw the underline (y + 2 for offset)
    
    doc.setFontSize(18);
    doc.setTextColor(0, 48, 143)
    doc.text("Strengths and Weaknesses:", 11, 133);


    // Top Strengths section
// Font size for Top Strengths title
// Top Strengths Section
doc.setFontSize(16); // Font size for Top Strengths title
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
doc.setFontSize(16); // Font size for Main Weaknesses title
const mainWeaknessesTitle = 'Main Weaknesses (bottom two scores):';
// Set the Y position for Main Weaknesses title
const weaknessesTitleY = strengthsYPosition + 10; // Minimal space after strengths content
doc.text(mainWeaknessesTitle, 10, weaknessesTitleY); // Draw the Main Weaknesses title
// apk file is here running 
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
const boxWidth = 192 - decreaseAmount; // Decrease the width of the box

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
        html2canvas(document.querySelector("#chartContainer"), { 
    scale: 1.5, // Increase scale for better quality
    useCORS: true, // If needed for external resources like images
    backgroundColor: null, // Transparent background if needed
    onclone: (clonedDoc) => {
        // Increase font size in the cloned document, but with controlled scaling
        clonedDoc.querySelectorAll('*').forEach(el => {
            let computedStyle = window.getComputedStyle(el);
            let fontSize = parseFloat(computedStyle.fontSize); // Get current font size

            // Controlled font size increase with a maximum limit
            let newFontSize = fontSize * 1.2; // Adjust the multiplier (use 1.2 instead of 1.5)
            if (newFontSize > 19) { // Set a maximum font size (e.g., 24px)
                newFontSize = 19;
            }

            el.style.fontSize = newFontSize + 'px'; // Apply the new font size
        });
    }
}).then(canvas => {
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            const thresholdHeight = 350; // Increased crop height
            let yPosition = 220; // Start position for the bar chart on the first page
            let remainingHeight = imgHeight;
            let startCropY = 0; // Initial start point for cropping

            // Function to crop and add image to PDF
            const addImageToPDF = (startY, height, yPos, scale = 10) => {
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
                doc.text("Testimonial Readiness Assessment Score", 37, 12);
                doc.setFontSize(11);
                const Identifier = document.getElementById("identifier").value;
                     doc.setTextColor(0, 0, 0);
          doc.setFontSize(11);
        // doc.text(`Provider Name or Identifier: ${Identifier}`, 10, 40);
const offset2 = 10;  // Position offset for the text
const textY2 = 40;  // Y position for the text
const underlineY2 = 41 ; // Y position for the underline, slightly below the text

// Add the text
doc.text(`Provider Name / Identifier: ${Identifier}`, offset2, textY2);
// Calculate the width of the text
const textWidth2 = doc.getTextWidth(`Provider Name / Identifier: ${Identifier}`);
doc.setLineWidth(0.5);
// Set the underline start and end positions based on the text width
const underlineStartX2 = offset2 + 48;
const underlineEndX2 = underlineStartX2 + 30;  // Extend the underline by 12 units after the text

// Set the color for the underline
doc.setDrawColor(0, 0, 0);

// Draw the underline after the text
doc.line(underlineStartX2, underlineY2, underlineEndX2, underlineY2);

    // Get today's date 
const rater = document.getElementById("Rater").value; // Retrieve the value of the Rater input
doc.setFontSize(11);
doc.setTextColor(0, 0, 0);
// doc.text(`Rater Name or Identifier: ${rater}`, 10,50); // Add the Rater value into the PDF
const offset1 = 10;  // Position offset for the text
const textY = 50;  // Y position for the text
const underlineY1 = textY + 1; // Y position for the underline, slightly below the text

// Add the text
doc.text(`Rater Name / Identifier :`, offset1, textY);

const staticTextWidth = doc.getTextWidth('Rater Name / Identifier:');
const raterX = 17 + staticTextWidth
doc.text(`${rater}`, raterX, textY);
// Calculate the width of the text
 doc.getTextWidth(`Rater Name / Identifier : ${rater}`);
doc.setLineWidth(0.5);
// Set the underline start and end positions based on the text width
const underlineStartX = offset1 +  48;
const underlineEndX = underlineStartX + 30;  // Extend the underline by 12 units after the text

// Set the color for the underline
doc.setDrawColor(0, 0, 0);

// Draw the underline after the text
doc.line(underlineStartX, underlineY1, underlineEndX, underlineY1);
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    doc.setFontSize(11);

    doc.text(`Assessment Date: ${formattedDate}`, 10, 30);
                
                doc.setTextColor(0, 0, 0)
                doc.setFontSize(11)
                doc.text("Sub-scales(continued):", 10, 69);
                

    // Create axis
    const axisY = 65; // Y position for the axis
    const axisXStart = 18; // X start position for the axis
    const axisXEnd = 185; // X end position for the axis
    const yLabels = [-100, -75, -50, -25, 0, 25, 50, 75, 100];
    const labelSpacing = (axisXEnd - axisXStart) / (yLabels.length - 1) + 1;

   doc.setFontSize(7); // Decrease to your desired size
   doc.setTextColor(136,136,136)
    // Draw labels
    yLabels.forEach((label, index) => {
        const xPosition = axisXStart + index * labelSpacing;
        doc.text(label.toString(), xPosition, axisY + 10, { align: "center" });
    });
                // doc.setLineWidth(0.5);
                // doc.line(10, 62, 10 + doc.getTextWidth("Sub-scale-continues:"), 62);

                yPosition = 76; // Reset Y position for the new page

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
doc.setTextColor(0, 0, 0);
doc.setFont("helvetica", "bold");

const title = "Testimonial Readiness Assessment Score";
const subtitle = "Rater Scores Raw Data";
const titleWidth = doc.getTextWidth(title);
const subtitleWidth = doc.getTextWidth(subtitle);

// Center Title
const titleYPosition = 9;  // Adjust this to move the title higher
doc.text(title, (pageWidth - titleWidth) / 2, titleYPosition);

doc.setFontSize(14);
doc.setFont("helvetica", "bold");

// Center Subtitle
const subtitleYPosition = 18;  // Adjust this to msove the subtitle higher or lower
doc.text(subtitle, (pageWidth - subtitleWidth) / 2, subtitleYPosition);


            // Capture and Add Image from assessmentForm
            html2canvas(document.querySelector("#assessmentForm"),{ 
    scale: 1.5, // Increase scale for better quality
    useCORS: true, // If needed for external resources like images
    backgroundColor: null, // Transparent background if needed
    onclone: (clonedDoc) => {
        // Increase font size and enhance styling for only span elements associated with radio buttons
        clonedDoc.querySelectorAll('input[type="radio"] + span').forEach(el => {
            let computedStyle = window.getComputedStyle(el);
            let fontSize = parseFloat(computedStyle.fontSize); // Get current font size

            // Controlled font size increase
            let newFontSize = fontSize * 1.2; // Adjust the multiplier (e.g., 1.2)
            if (newFontSize > 28) { // Set a maximum font size, if needed
                newFontSize = 28;
            }

            // Apply enhanced styling for visual clarity
            el.style.fontSize = newFontSize + 'px'; // Apply the new font size
            el.style.fontWeight = 'bold'; // Make text bold
            // el.style.color = '#000000'; // Change text color to black for better contrast
            // el.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.2)'; // Add a slight text shadow for depth
        });
    }
}).then(canvas => {
                const imgData = canvas.toDataURL("image/png");
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;

                let yPosition = 22; // Start position for assessment form on third page
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
                    yPosition = 7; // Reset Y position for the new page

                    // Add the remaining part of the assessment form image
                    addImageToPDF(startCropY, remainingHeight);
                    remainingHeight = 0; // All remaining image has been added
                }
// Get today's date dynamically and format it for the filename
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit", // Change to "2-digit" for consistent formatting
        day: "2-digit"
    }).replace(/\//g, "-"); // Replace slashes with hyphens

    // Retrieve the Identifier
    const identifier = document.getElementById("identifier").value;

    // Construct the filename
    const instrumentName = "Testimonial Readiness Assessment"; // Use your actual instrument name
    const filename = `${instrumentName}.${identifier}.${formattedDate}.pdf`;

    // Your existing code for PDF content...

    // At the end, save the PDF with the new filename
    doc.save(filename); // Use the constructed filename
                
            });
        });
}

export{
    generatePDF
}
