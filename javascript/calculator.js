var modules;
var calc2Index1, calc2Index2;
function calculation2() {
	var list = modules.allYears.sort().reverse();
	var calculation2 = {
		value1: list[calc2Index1-1],
		value2: list[calc2Index2-1]
	}
	return calculation2;
}
function calculation1(list) {
	var count = 0;
	for(var i=0;i<list.length;i++) {
		count += parseFloat(list[i]);
	}
	return count/list.length
}
function calculate() {
	modules = {average:{},allYears:[]};
	getModules();
	for(var i=2;i<=years;i++) {
		modules.average[i] = calculation1(modules[i]);
		modules.allYears = modules.allYears.concat(modules[i]);
		$('h3 span.average'+i).text(" - "+Math.ceil(modules.average[i] * 10) / 10+"%")
	}
	modules.calc1 = calculation1(modules.allYears);
	modules.calc2 = calculation2();
	var calc1ClassIndex = findIndex(modules.calc1,averageClassifications);
	var calc2ClassIndex1 = findIndex(modules.calc2.value1,gradeClassifications);
	var calc2ClassIndex2 = findIndex(modules.calc2.value2,gradeClassifications);
	if(calc2ClassIndex1 == calc2ClassIndex2) {
		var calc2ClassIndex = calc2ClassIndex1;
	} else {
		var calc2ClassIndex = calc2ClassIndex2;
	}
	var classification = combineCalcs(calc1ClassIndex,calc2ClassIndex);
	if(classification) {
		if(classification.borderline) {
			classification = averageClassifications[findIndex(modules.average[years],gradeClassifications)];
			updateResults("borderline",classification,calc1ClassIndex,calc2ClassIndex)
		} else {
			updateResults("okay",classification,calc1ClassIndex,calc2ClassIndex)
		}
	} else {
		updateResults("error",classification,calc1ClassIndex,calc2ClassIndex)
	}
	$('#classification').show("slide",{direction:"up"},200);
}
function findIndex(grade,list) {
	for(var i=0;i<list.length;i++) {
		if(grade>=list[i].lower_bound
			&& grade<list[i].upper_bound) {
			if(list[i].avg_class_link) {
				return list[i].avg_class_link;
			} else {
				return i;
			}
		}
	}
}
function getModules() {
	for(var i=2;i<=years;i++) {
		modules[i]=[]
		$("#"+i+" .module").each(function() {
			var countsFor = parseInt($(this).find('.credits').val())/5;
			if(i==3 || i==4) {
				countsFor = countsFor*2;
			}
			for(var j=0; j<countsFor; j++) {
				modules[i].push(parseFloat($(this).find('.percent').val()))
			}
		});
	}
	if(years==4) {
		calc2Index1 = 50;
		calc2Index2 = 60;
	} else {
		calc2Index1 = 30;
		calc2Index2 = 36;
	}
}
function combineCalcs(calc1,calc2) {
	if(calc1==calc2) {
		return averageClassifications[calc1];
	} else
	if(Math.abs(calc1-calc2)==1) {
		if(calc1%2==0) {
			return averageClassifications[calc1];
		} else {
			return averageClassifications[calc2];
		}
	} else 
	if(Math.abs(calc1-calc2)==2) {
		return averageClassifications[Math.min(calc1,calc2)+1];
	} else {
		return null;
	}
}
function updateResults(type, classification, calc1Index, calc2Index) {
	var generic = "<p>The result of your weighted average grade was a <strong>"
		+averageClassifications[calc1Index].name
		+"</strong> ("+Math.ceil(modules.calc1 * 10) / 10+"%) and the result of the distribution of your weighted grades was a <strong>"
		+averageClassifications[calc2Index].name
		+"</strong>.</p>"
	if(type=="error") {
		$('#classification h3').text("Oops!");
		$('#classification #detail').html(
			"<p>Unfortunately it was not possible to calculate your degree classification due to the two classes being too different.</p>"
			+generic
			+"<p>You will be awarded a degree classification that the examiners think best suits your performance</p>"
		);
	} else if (type=="borderline") {
		$('#classification h3').text(classification.name);
		$('#classification #detail').html(
			"<p>You were on the borderline so the examiners will look at your weighted average grade from your final year as guidance. "
			+"You're weighted average grade from your final year is "
			+(modules.average[4] || modules.average[3])
			+"%, this classifies to a "
			+classification.name+".</p>"
			+generic
		);
	} else {
		$('#classification h3').text(classification.name);
		$('#classification #detail').html(generic)
	}
}



var averageClassifications = [
	{name: "First",
	lower_bound: 69.5,
	upper_bound: 101},
	{name: "First/2.1 borderline",
	lower_bound: 68,
	upper_bound: 69.5,
	borderline:true},
	{name: "2.1",
	lower_bound: 59.5,
	upper_bound: 68},
	{name: "2.1/2.2 borderline",
	lower_bound: 58,
	upper_bound: 59.5,
	borderline:true},
	{name: "2.2",
	lower_bound: 49.5,
	upper_bound: 58},
	{name: "2.2/Third borderline",
	lower_bound: 48,
	upper_bound: 49.5,
	borderline:true},
	{name: "Third",
	lower_bound: 44.5,
	upper_bound: 48},
	{name: "Third/Pass borderline",
	lower_bound: 43.5,
	upper_bound: 44.5,
	borderline:true},
	{name: "Pass",
	lower_bound: 39.5,
	upper_bound: 43.5},
	{name: "Pass/Fail borderline",
	lower_bound: 38,
	upper_bound: 39.5,
	borderline:true},
	{name: "Fail",
	lower_bound: 0,
	upper_bound: 38}
];
var gradeClassifications = [
	{name: "First",
	lower_bound: 69.5,
	upper_bound: 101,
	avg_class_link: 0},
	{name: "2.1",
	lower_bound: 59.5,
	upper_bound: 69.5,
	avg_class_link: 2},
	{name: "2.2",
	lower_bound: 49.5,
	upper_bound: 59.5,
	avg_class_link: 4},
	{name: "Third",
	lower_bound: 44.5,
	upper_bound: 49.5,
	avg_class_link: 6},
	{name: "Pass",
	lower_bound: 39.5,
	upper_bound: 44.5,
	avg_class_link: 8},
	{name: "Fail",
	lower_bound: 0,
	upper_bound: 39.5,
	avg_class_link: 10}
];