$(document).ready(function() {
	if(localStorageAllowed) {
		if(localStorage.modules) {
			var modules = JSON.parse(localStorage.modules)
			for(var i = 0; i<modules.length; i++) {
				var module = modules[i];
				insertModule(module);
				if(module.assessments && module.assessments.length!==0) {
					for(var j=0; j<module.assessments.length;j++) {
						insertAssessment($('#'+module.year+" .splitButton").last(),module.assessments[j]);
					}
					openAssessments($('#'+module.year+" .splitButton").last());
				}
			}
		}
		if(localStorage.course_length) {
			$("input[name='courseLength'][value='"+localStorage.course_length+"']").prop('checked', true);
		}
	}
	checkErrors();
});

function store() {
	if(localStorageAllowed) {
		localStorage.course_length = $("input[name='courseLength']:checked").val();
		var modules = []
		$(".module").each(function() {
			var module = {
				year: $(this).find(".year").val(),
				name: $(this).find(".name").val(),
				credits: $(this).find(".credits").val(),
				percent: $(this).find(".percent").val(),
			}
			module.assessments = []
			$(this).find('.assessments .assessment').each(function() {
				var assessment = {
					name:$(this).find(".nameAss").val(),
					weight:$(this).find(".weightAss").val(),
					mark:$(this).find(".percentAss").val()
				}
				module.assessments.push(assessment);
			});
			modules.push(module);
		});
		localStorage.modules = JSON.stringify(modules);
	}
}