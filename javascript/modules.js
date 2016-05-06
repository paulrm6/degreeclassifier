var years = 3;

$(document).on("click",".addModule",function() {
	insertModule(null,this);
	store();
	checkErrors();
})

function openAssessments(button) {
	$(button).attr("split",true);
	$(button).text("Add");
	$(button).parents(".module").find(".percent").first().attr("disabled","disabled")
	$(button).parents(".module").find('.percentSymbol').first().addClass("disabled");
	$(button).parents(".module").find('.assessments').show();
}

$(document).on("click",".dltButton",function() {
	if($(this).parents(".assessment").length>0) {
		if($(this).parents(".assessments").find(".assessment").length===1) {
			$(this).parents(".module").find(".splitButton").removeAttr("split");
			$(this).parents(".module").find(".splitButton").text("Break Down");
			$(this).parents(".module").find(".percent").first().removeAttr("disabled")
			$(this).parents(".module").find('.percentSymbol').first().removeClass("disabled");
			$(this).parents(".assessments").hide();
			$(this).parents(".assessment").remove();
		} else {
			$(this).parents(".assessment").remove();
		}
	} else {
		$(this).parents(".module").remove();
	}
	store();
	checkErrors();
})

$(document).on("click",".splitButton",function() {
	if($(this).attr("split")) {
		insertAssessment(this);
	} else {
		openAssessments(this);
		insertAssessment(this,{name:'',weight:100,mark:$(this).parents(".module").find(".percent").val()});
	}
	updateAssessmentAverage();
})

function insertAssessment(button,prefill) {
	if(!prefill) {
		prefill={name:"",weight:"",mark:""}
	}
	var html = "<div class='assessment'><div class='inputs'>"
		+			"<input class='nameAss' type='text' placeholder='e.g. Exam' value='"+prefill.name+"' />"
		+			"<input class='weightAss' placeholder='Weight' type='number' value='"+prefill.weight+"' /><span class='percentSymbol'>%</span>"
		+			"<input class='percentAss' placeholder='Mark' type='number' value='"+prefill.mark+"' /><span class='percentSymbol'>%</span></div>"
		+			"<div class='buttons'><button class='dltButton button'>Delete Assessment</button></div>"
		+		"</div>";
	$(button).parents('.module').find('.assessments .error').before(html);
}

function insertModule(prefill, button) {
	if(!prefill) {
		prefill = {
			year: $(button).parent().attr('id'),
			name: "",
			credits: "",
			percent: ""
		}
	}
	var html = "<div class='module'><div class='inputs'>"
		+			"<input hidden='hidden' class='year' value="+prefill.year+" />"
		+			"<input class='name' type='text' placeholder='Module Name/Code' value='"+prefill.name+"' />"
		+			"<input class='credits' placeholder='Credits' type='number' value='"+prefill.credits+"' />"
		+			"<input class='percent' placeholder='Mark' type='number' value='"+prefill.percent+"' /><span class='percentSymbol'>%</span></div>"
		+			"<div class='buttons'><button class='splitButton button'>Break Down</button>"
		+			"<button class='dltButton button'>Delete Module</button></div>"
		+			"<div class='assessments'><div class='error'></div></div>"
		+		"</div>";
	$('#'+prefill.year+" .addModule").before(html);
}

function updateAssessmentAverage() {
	var bigError = false;
	$('.assessments').each(function() {
		if($(this).is(':visible')) {
			var error = false;
			var weight = 0;
			var percent = 0;
			$(this).find('.assessment').each(function() {
				var deltaWeight = parseFloat($(this).find('.weightAss').val())
				var deltaPercent = parseFloat($(this).find('.percentAss').val())
				if(deltaWeight>100 || deltaWeight<0 || isNaN(deltaWeight)) {
					$(this).find('.weightAss').addClass("errorBorder tooltip").attr("tooltip","Weighting must be between 0 and 100");
					error=true;
				} else {
					$(this).find('.weightAss').removeClass("errorBorder tooltip");
					if($(this).find('.weightAss').is(":hover")) {
						$('#tooltip').remove();
					}
				}
				if(deltaPercent>100 || deltaPercent<0 || isNaN(deltaPercent)) {
					$(this).find('.percentAss').addClass("errorBorder tooltip").attr("tooltip","Percentages must be between 0 and 100");
					error=true;
				} else {
					$(this).find('.percentAss').removeClass("errorBorder tooltip");
					if($(this).find('.percentAss').is(":hover")) {
						$('#tooltip').remove();
					}
				}
				if(!error) {
					weight += deltaWeight;
					percent += deltaPercent*deltaWeight;	
				} else {
					bigError = true;
				}
			});
			if(weight===100) {
				$(this).parents(".module").find(".percent").val(Math.round(percent/100))
				$(this).find('.error').text("");
			} else {
				bigError = true;
				$(this).find('.error').text("Weighting currently adds up to "+weight+"%, please add a further "+(100-weight)+"%.");
			}
		}
	});
	return bigError;
}

function checkErrors() {
	showHide4();
	var error = updateAssessmentAverage();
	for(var i=2;i<=years;i++) {
		var credits=0;
		$("#"+i+" .module").each(function() {
			var modulePercent = parseFloat($(this).find('.percent').val());
			var moduleCredits = parseInt($(this).find('.credits').val());
			if(isNaN(moduleCredits)) {
				moduleCredits = 0;
			}
			if(moduleCredits<1
				|| moduleCredits>120
				|| moduleCredits%5!==0) {
				$(this).find('.credits').addClass("errorBorder tooltip").attr("tooltip","Credits must be in multiples of 5, greater than 0 and less than 121");
				error=true;
			} else {
				credits += moduleCredits;
				$(this).find('.credits').removeClass("errorBorder tooltip");
				if($(this).find('.credits').is(":hover")) {
					$('#tooltip').remove();
				}
			}
			if(modulePercent<0
				|| modulePercent>100
				|| isNaN(modulePercent)) {
				$(this).find('.percent').addClass("errorBorder tooltip").attr("tooltip","Percentages must be between 0 and 100");
				error=true;
			} else {
				$(this).find('.percent').removeClass("errorBorder tooltip");
				if($(this).find('.percent').is(":hover")) {
					$('#tooltip').remove();
				}
			}
		});
		if(credits<120) {
			$('#'+i+' button+.error').text("Total valid credits only add up to "+credits+", you need an extra "+(120-credits)+".");
			error=true;
		} else {
			$('#'+i+' button+.error').text("");
		}
	}
	if(!error) {
		calculate();
	} else {
		$('h3 span').text("");
		$('#classification').hide("slide",{direction:"up"},200);
	}
}

function showHide4() {
	years = $("input[name='courseLength']:checked").val();
	if(years==4) {
		$(".4").show();
	} else {
		$(".4").hide();
	}
}
$(document).on("input","input",function() {
	updateAssessmentAverage();
	store();
	checkErrors();
});
$(document).on("change","input",function() {
	updateAssessmentAverage();
	showHide4();
	checkErrors();
	store();
});

$(document).on("keypress",".credits",function(e) {
	if(e.which == 46) {
		e.preventDefault();
	}
});

$(document).on("mouseenter",".tooltip",function() {
	var position = $(this).position()
	html = "<div id='tooltip' style='top:"+(position.top+$(this).outerHeight(true)+10)+"px;left:"+(position.left-135+$(this).outerWidth()/2)+"px;'>"+$(this).attr('tooltip')+"</div>";
	$('body').append(html);
});

$(document).on("mouseleave",".tooltip",function() {
	$('#tooltip').remove();
});