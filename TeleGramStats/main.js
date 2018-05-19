function generatePNG(){
	html2canvas(document.querySelector("#capture")).then(canvas => {
    document.body.appendChild(canvas)
});
     
}

//Interval
var myVar = setInterval(myTimer, 2000)

var Ycount = 0
var Ncount = 0
var option = {
  scales: {
    xAxes: [{
      gridLines: {
        offsetGridLines: true,
      }
    }],
    yAxes : [{
    	display: true,
    	ticks : {
    		beginAtZero : true,
    	}
    }]
  }
}

var myChart = document.getElementById('myChart').getContext('2d')
var barChart = new Chart(myChart, {
  type: 'bar', // pie,line,radar
  data: {
    labels: ['Yes', 'No'],
    datasets: [{
      label: 'Voting',
      data: [Ycount, Ncount],
      backgroundColor: ['blue', 'red']
    }]
  },
  options: option
})

function myTimer () {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	var data = JSON.parse(this.responseText);
	      Ycount = data.YesCount
  			Ncount = data.NoCount

  			barChart.data.datasets[0].data[0] = Ycount
  			barChart.data.datasets[0].data[1] = Ncount
  			barChart.update()
	    }
	};

xhttp.open("GET", "/select", true);
xhttp.send();
}

