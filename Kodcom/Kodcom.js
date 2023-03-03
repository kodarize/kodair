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
            if ($(this).val().substring(0, 18) === 'what is a komanoid') {
                $('#history').append('<br/>' + 'A Komanoid [koÊŠËˆhhjmÉ™ËŒnd] (from English man and -oid "resembling") is any creature or being with human-like form or characteristics that is part living and part technology/artificial' + '<br/>' + '<br/>');
            }
            if ($(this).val().substring(0, 17) === 'what is a kodagen') {
                $('#history').append('<br/>' + 'A Kodagen is a type of Komanoid that is more than 50% technology/artificial' + '<br/>' + '<br/>');
            }
            if ($(this).val().substring(0, 17) === 'what is a kodogen') {
                $('#history').append('<br/>' + 'A Kodogen is a type of Komanoid that is less than 50% technology/artificial' + '<br/>' + '<br/>');
            }
            if ($(this).val().substring(0, 17) === 'what is a kodigen') {
                $('#history').append('<br/>' + 'A Kodigen is a type of Komanoid that frequently or easily changes between a Kodagen and a Kodogen, or has parts that are both technological/artificial and real at the same time (a superposition between real and technological/artificial)' + '<br/>' + '<br/>');
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