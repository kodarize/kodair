$(function() {
    $('.terminal').on('click', function() {
        $('#input').focus();
    });

    $('#input').on('keydown', function search(e) {
        if (e.keyCode == 13) {
            // append your output to the history,
            // here I just append the input
            $('#history').append('You typed: ' + $(this).val() + '<br/>');

            // you can change the path if you want
            // crappy implementation here, but you get the idea
            if ($(this).val().substring(0, 3) === 'cd ') {
                $('#path').html($(this).val().substring(3) + '&nbsp;>&nbsp;');
            }
            if ($(this).val().substring(0, 5) === 'hello' || $(this).val().substring(0, 2) === 'hi') {
                $('#history').append('hello user' + '<br/>');
            }
            if ($(this).val().substring(0, 4) === 'time' || $(this).val().substring(0, 13) === 'date and time') {
                let currentDate = new Date();
                let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
                $('#history').append(time + '<br/>');
            }
            if ($(this).val().substring(0, 4) === 'date') {
                let current = new Date();
                let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
                $('#history').append(cDate + '<br/>');
            }
            if ($(this).val().substring(0, 4) === 'year') {
                let currentDate = new Date();
                let cYear = currentDate.getFullYear()
                $('#history').append(cYear + '<br/>');
            }
            if ($(this).val().substring(0, 5) === 'month') {
                let currentDate = new Date();
                let cMonth = currentDate.getMonth() + 1
                $('#history').append(cMonth + '<br/>');
            }
            if ($(this).val().substring(0, 3) === 'day') {
                let currentDate = new Date();
                let cDay = currentDate.getDate()
                $('#history').append(cDay + '<br/>');
            }
            if ($(this).val().substring(0, 4) === 'help') {
                $('#history').append('Commands: cd, clear, date, date and time, day, help, hi, month, time, year, hello' + '<br/>');
            }
            if ($(this).val().substring(0, 5) === 'clear') {
                $('#history').html('');
            }

            // clear the input
            $('#input').val('');

        }
    });
});