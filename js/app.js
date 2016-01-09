/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());

var model = {
    numStudents : 7,
    numDays: 12,
    attendance: null,
    students : [
        {
            name: 'Kano',
            id: 'kano',
            daysMissed: []
        },
        {
            name: 'Liu Kang',
            id: 'liu-kang',
            daysMissed: []
        },
        {
            name: 'Raiden',
            id: 'raiden',
            daysMissed: [],
        },
        {
            name: 'Johnny Cage',
            id: 'johnny-cage',
            daysMissed: []
        },
        {
            name: 'Scorpion',
            id: 'scorpion',
            daysMissed: []
        },
        {
            name: 'Sub Zero',
            id: 'sub-zero',
            daysMissed: []
        },
        {
            name: 'Sonya',
            id: 'sonya',
            daysMissed: []
        }
    ]
};

var view = {

    init: function() {
        this.tableHead = $('#table-head');
        this.tableBody = $('#table-body');
        this.render();
    },

    render: function() {
        this.createHeaderRow();
        this.createStudentRows();
        this.countMissing();

    },

    createHeaderRow: function() {
        var numDays = octopus.getNumDays();
        var htmlStr = '<tr><th class="name-col">Student Name</th>';

        for(var i = 1; i <= numDays; i ++) {
            htmlStr += '<th>' + i + '</th>';
        }

        htmlStr += '<th class="missed-col">Days Missed</th></tr>';
        this.tableHead.append(htmlStr);
    },

    createStudentRows: function() {
        var students = octopus.getStudents();
        for (i = 0; i < students.length; i ++) {

            var student = students[i];
            var htmlStr = '<tr class="student" id=' + student.id + '><td class="name-col">' + student.name + '</td>';

            for (j = 0; j < octopus.getNumDays(); j++) {
                htmlStr += '<td class="attend-col"><input type="checkbox"';
                if(!student.daysMissed.includes(j+1)) {
                    htmlStr += ' checked';
                }

                htmlStr += '></td>';
            }

            htmlStr += '<td class="missed-col">' + student.daysMissed.length + '</td></tr>';

            this.tableBody.append(htmlStr);
        }
    },

    countMissing: function() {
        $allMissed = $('tbody .missed-col');
        $allMissed.each(function() {
            var studentRow = $(this).parent('tr'),
                dayChecks = $(studentRow).children('td').children('input'),
                numMissed = 0;

            dayChecks.each(function() {
                if (!$(this).prop('checked')) {
                    numMissed++;
                }
            });

            $(this).text(numMissed);
        });
    },

    // Check boxes, based on attendance records
    checkBoxes: function() {

        $.each(model.attendance, function(name, days) {
            var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                dayChecks = $(studentRow).children('.attend-col').children('input');

            dayChecks.each(function(i) {
                $(this).prop('checked', days[i]);
            });
        });
    }

};

var octopus = {

    init : function() {
        view.init();
        model.attendance = octopus.getLocalStorage();
        view.checkBoxes();
        octopus.updateLocalStorage();
        view.countMissing();
    },

    getNumDays : function() {
        return model.numDays;
    },

    getStudents : function() {
        return model.students;
    },

    getLocalStorage : function() {

        this.attendance = JSON.parse(localStorage.attendance);

        return this.attendance;
    },

    updateLocalStorage : function() {
        $allCheckboxes = $('tbody input');
        // When a checkbox is clicked, update localStorage
        $allCheckboxes.on('click', function() {
        var studentRows = $('tbody .student'),
            newAttendance = {};

        studentRows.each(function() {
            var name = $(this).children('.name-col').text(),
                $allCheckboxes = $(this).children('td').children('input');

            newAttendance[name] = [];

            $allCheckboxes.each(function() {
                newAttendance[name].push($(this).prop('checked'));
            });
        });

        view.countMissing();
        localStorage.attendance = JSON.stringify(newAttendance);
        });
    }
};

octopus.init();