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
    students : [
        {
            name: 'Kano',
            id: 'kano',
            daysMissed: [1,3,5,7]
        },
        {
            name: 'Liu Kang',
            id: 'liu-kang',
            daysMissed: [2,8]
        },
        {
            name: 'Raiden',
            id: 'raiden',
            daysMissed: [4,7,9],
        },
        {
            name: 'Johnny Cage',
            id: 'johnny-cage',
            daysMissed: [1,2,3,4,5]
        },
        {
            name: 'Scorpion',
            id: 'scorpion',
            daysMissed: [2]
        },
        {
            name: 'Sub Zero',
            id: 'sub-zero',
            daysMissed: [2]
        },
        {
            name: 'Sonya',
            id: 'sonya',
            daysMissed: [8,1]
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
    }
};

var octopus = {

    init : function() {
        view.init();
    },

    getNumStudents : function() {
        return model.numStudents;
    },

    getNumDays : function() {
        return model.numDays;
    },

    getStudents : function() {
        return model.students;
    },

    getLocalStorage : function() {

        var attendance = JSON.parse(localStorage.attendance);

        return attendance;
    }
};

/* STUDENT APPLICATION */
$(function() {

    octopus.init();

    var attendance = octopus.getLocalStorage();

    $allMissed = $('tbody .missed-col');
    $allCheckboxes = $('tbody input');

    view.countMissing();

    // Count a student's missed days
    function countMissing() {
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
    }

    // Check boxes, based on attendace records
    $.each(attendance, function(name, days) {
        var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
            dayChecks = $(studentRow).children('.attend-col').children('input');

        dayChecks.each(function(i) {
            $(this).prop('checked', days[i]);
        });
    });

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

        countMissing();
        localStorage.attendance = JSON.stringify(newAttendance);
    });

    countMissing();


}());
