// var slider = document.getElementById("mySlider");

// d3.select(slider).on("mouseup", function() {
// 	year = parseFloat(this.value);
// 	var metadataDiv = d3.select(".metadata");
// 	metadataDiv.selectAll("*").remove();
// 	// metadataDiv.append("text").text(`${year}`)
        
//     d3.json(`/metadata/${year}/`, function(jsonData) {
// 		jsonData.forEach(function(d) {
// 			attendance = d.Attendance;
// 			fourth = d.Fourth;
// 			goalsScored = d.GoalsScored;
// 			host = d.Host;
// 			matchesPlayed = d.MatchesPlayed;
// 			qualifiedTeams = d.QualifiedTeams;
// 			runnerUp = d["Runners-Up"];
// 			third = d.Third;
// 			winner = d.Winner;
// 			wc_year = d.Year;
//         });
        
// 		metadataDiv.append("text").text(
// 		`Year: ${wc_year}
// 		Attendance: ${attendance}
// 		Fourth: ${fourth}
// 		Goals Scored: ${goalsScored}
// 		Host: ${host}
// 		Matches Played: ${matchesPlayed}
// 		QualifiedTeams: ${qualifiedTeams}
// 		Runners-Up: ${runnerUp}
// 		Third: ${third}
// 		Winner: ${winner}`
// 		);
// 	})
// });
console.log('test test');

var slider = document.getElementById("mySlider");
			d3.select(slider).on("mouseup", function() {
				year = parseFloat(this.value);
				console.log(year);
				var metadataDiv = d3.select(".metadata");
				metadataDiv.selectAll("*").remove();
				// metadataDiv.append("text").text(`${year}`)
				d3.json(`/metadata/${year}`, function(jsonData) {
					jsonData.forEach(function(d) {
						attendance = d.Attendance;
						fourth = d.Fourth;
						goalsScored = d.GoalsScored;
						host = d.Host;
						matchesPlayed = d.MatchesPlayed;
						qualifiedTeams = d.QualifiedTeams;
						runnerUp = d["Runners-Up"];
						third = d.Third;
						winner = d.Winner;
						wc_year = d.Year;
					});
					metadataDiv.append("text").text(
					`Year: ${wc_year}
					Attendance: ${attendance}
					Fourth: ${fourth}
					Goals Scored: ${goalsScored}
					Host: ${host}
					Matches Played: ${matchesPlayed}
					QualifiedTeams: ${qualifiedTeams}
					Runners-Up: ${runnerUp}
					Third: ${third}
					Winner: ${winner}`
					);
				})
          	});