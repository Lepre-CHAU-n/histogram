//Issues to fix: 100 max error (one case)
//histogram color not updated, error

var grades = [65.95, 56.98, 78.62, 96.1, 90.3, 72.24, 92.34, 60.00, 81.43, 86.22, 88.33, 9.03,
    49.93, 52.34, 53.11, 50.10, 88.88, 55.32, 55.69, 61.68, 70.44, 70.54, 90.0, 71.11, 80.01];
// var grades= []; 
var histogramContainer = document.querySelector('.histogram');
var enterGradeInput = document.getElementById('enterGrade');




var errorMessage = document.getElementById('errorMessage');
var errorMessage1 = document.getElementById('errorMessage1');

function updateHistogram() {
   var newLowerBounds = getLowerBounds();
   var variables = [
       { id: 'aPlus', variable: 'a' },
       { id: 'aNeutral', variable: 'a1' },
       { id: 'aMinus', variable: 'a2' },
       { id: 'bPlus', variable: 'b' },
       { id: 'bNeutral', variable: 'b1' },
       { id: 'bMinus', variable: 'b2' },
       { id: 'cPlus', variable: 'c' },
       { id: 'cNeutral', variable: 'c1' },
       { id: 'cMinus', variable: 'c2' },
       { id: 'dNeutral', variable: 'd' }
   ];

   for (var i = 0; i < variables.length; i++) {
       var element = document.getElementById(variables[i].id);
       var value = parseFloat(element.value);

       if (isNaN(value)) {
           errorMessage.textContent = 'Invalid lower bounds. Please make sure the values are in ascending order and/or enter a number for each grade.';
           element.value = ''; // Clear the input text
           return;
       } else {
           var inputs = element.value;
           var sanitizedInputs = inputs.replace(/[^0-9.]/g, ''); // Allow decimal numbers
           element.value = sanitizedInputs;
           errorMessage.textContent = ''; // Clear the error message
       }
   }

   if (validateLowerBounds(newLowerBounds)) {
       // Validate each lower bound for letters
       for (var j = 0; j < newLowerBounds.length; j++) {
           if (isNaN(newLowerBounds[j])) {
               errorMessage.textContent = 'Invalid lower bounds. Please make sure the values are in ascending order and/or enter a number for each grade.';
               return;
           }
       }
       errorMessage.textContent = ''; // Clear the error message
       var histogram = calculateHistogram(grades, newLowerBounds);
       displayHistogram(histogram);
   } else {
       errorMessage.textContent = 'Invalid lower bounds. Please make sure the values are in ascending order and/or enter a number for each grade.';
       container.appendChild(errorElement);
       // Clear the histogram if the lower bounds are invalid
       histogramContainer.innerHTML = '';
   }
}


function getLowerBounds() {
  var lowerBounds = [];
  lowerBounds.push(parseFloat(document.getElementById('Max').value));
  lowerBounds.push(parseFloat(document.getElementById('aPlus').value));
  lowerBounds.push(parseFloat(document.getElementById('aNeutral').value));
  lowerBounds.push(parseFloat(document.getElementById('aMinus').value));
  lowerBounds.push(parseFloat(document.getElementById('bPlus').value));
  lowerBounds.push(parseFloat(document.getElementById('bNeutral').value));
  lowerBounds.push(parseFloat(document.getElementById('bMinus').value));
  lowerBounds.push(parseFloat(document.getElementById('cPlus').value));
  lowerBounds.push(parseFloat(document.getElementById('cNeutral').value));
  lowerBounds.push(parseFloat(document.getElementById('cMinus').value));
  lowerBounds.push(parseFloat(document.getElementById('dNeutral').value));
  lowerBounds.push(parseFloat(document.getElementById('fNeutral').value));
  return lowerBounds;
}

function validateLowerBounds(lowerBounds) {
  for (var i = 1; i < lowerBounds.length; i++) {
      if (lowerBounds[i] > lowerBounds[i - 1]) {
          return false;
      }
  }
  return true;
}

function calculateHistogram(grades, lowerBounds) {
   var histogram = [];
   for (var i = 0; i < lowerBounds.length; i++) {
       var count = 0;
       var a = 0;
       for (var j = 0; j < grades.length; j++) {
        if (grades[j] > lowerBounds[i]) {
            a++;
        } else if(grades[j] === lowerBounds[0]){
            count++;
        }  else if (grades[j] >= lowerBounds[i + 1] && grades[j] < lowerBounds[i]) {
            count++;
        } 
       }
       histogram.push(count);
   }
   return histogram;
}


function displayHistogram(histogram) {
   histogramContainer.innerHTML = '';
   var gradeLabels = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
   var histogramTitle = document.createElement('h3');
   histogramTitle.textContent = 'Histogram';
   histogramContainer.appendChild(histogramTitle);

   var maxCount = Math.max(...histogram); // Get the maximum count for scaling the bar width
   var histogramBarHeight = '20px'; // Height of the histogram bars
   var maxBarWidth = 300; // Maximum width of the histogram bar container (adjust as needed)

   for (var i = 0; i < histogram.length - 1; i++) { // Adjust loop condition to exclude the extra bottom bar
       var gradeDiv = document.createElement('div');
       gradeDiv.style.display = 'flex'; // Set display to flex for aligning grade label and histogram bar
       gradeDiv.style.alignItems = 'center'; // Align items vertically in the flex container
       gradeDiv.style.width = maxBarWidth + 'px'; // Set fixed width for the gradeDiv container

       var gradeLabel = document.createElement('p');
       gradeLabel.textContent = gradeLabels[i];
       gradeLabel.style.width = '40px'; // Set fixed width for the grade label

       var histogramBarContainer = document.createElement('div');
       histogramBarContainer.style.width = maxBarWidth - 50 + 'px'; // Set fixed width for the histogram bar container
       histogramBarContainer.style.backgroundColor = 'lightgray';
       histogramBarContainer.style.height = histogramBarHeight;

       var histogramBar = document.createElement('div');
       histogramBar.style.width = (histogram[i] / maxCount) * 100 + '%'; // Scale the bar width based on the maximum count
       histogramBar.style.backgroundColor = 'gray';
       histogramBar.style.height = histogramBarHeight;

       var gradeCount = document.createElement('span');
       gradeCount.textContent = histogram[i]; // Display the count for the current grade

       histogramBarContainer.appendChild(histogramBar);
       gradeDiv.appendChild(gradeLabel);
       gradeDiv.appendChild(histogramBarContainer);
       gradeDiv.appendChild(gradeCount); // Append the grade count to the gradeDiv
       histogramContainer.appendChild(gradeDiv);
   }
}

enterGradeInput.addEventListener('keydown', function(event) {
    var invalidChars = ['e', 'E', '+', '-'];
    if (invalidChars.includes(event.key)){
        event.preventDefault();
    }
});

enterGradeInput.addEventListener('keyup', function(event) {
   if (event.key === 'Enter' ) {
       var grade = parseFloat(enterGradeInput.value);
       enterGradeInput.value = '';
       errorMessage1.textContent = ''; // Clear the error message
       if (isNaN(grade) || grade < 0 || grade > 100) {
           errorMessage1.textContent = 'Invalid grade. Please enter a number between 0 and 100.';
           return;
       }

       grades.push(grade);
       updateHistogram();
   } 
});


document.querySelectorAll('.lowerBounds input[type="number"]').forEach(function(input) {
  input.addEventListener('keyup', function() {
      updateHistogram();
  });
});

updateHistogram();