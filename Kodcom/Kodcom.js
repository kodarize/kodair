$(function() {
    let commandHistory = [];
    let historyIndex = 0;
    
    $('.terminal').on('click', function() {
        $('#input').focus();
    });

    $('#input').on('keydown', function search(e) {
        if (e.keyCode == 13) {
            // append your output to the history,
            // here I just append the input
            $('#history').append('You typed: ' + $(this).val() + '<br/>');
            
            let inputValue = $(this).val().toLowerCase();

            // you can change the path if you want
            // crappy implementation here, but you get the idea
            if (inputValue.substring(0, 3) === 'cd ') {
                $('#path').html(inputValue.substring(3) + '&nbsp;>&nbsp;');
            }
            else if (inputValue.substring(0, 18) === 'what is a komanoid') {
                $('#history').append('<br/>' + 'A Komanoid [koÊŠËˆhhjmÉ™ËŒnd] (from English man and -oid "resembling") is any creature or being with human-like form or characteristics that is part living and part technology/artificial' + '<br/>' + '<br/>');
            }
            else if (inputValue.substring(0, 17) === 'what is a kodagen') {
                $('#history').append('<br/>' + 'A Kodagen is a type of Komanoid that is more than 50% technology/artificial' + '<br/>' + '<br/>');
            }
            else if (inputValue.substring(0, 17) === 'what is a kodogen') {
                $('#history').append('<br/>' + 'A Kodogen is a type of Komanoid that is less than 50% technology/artificial' + '<br/>' + '<br/>');
            }
            else if (inputValue.substring(0, 17) === 'what is a kodigen') {
                $('#history').append('<br/>' + 'A Kodigen is a type of Komanoid that frequently or easily changes between a Kodagen and a Kodogen, or has parts that are both technological/artificial and real at the same time (a superposition between real and technological/artificial)' + '<br/>' + '<br/>');
            }
            else if (inputValue.substring(0, 5) === 'hello' || inputValue.substring(0, 2) === 'hi') {
                $('#history').append('hello user' + '<br/>');
            }
            else if (inputValue.substring(0, 4) === 'time' || inputValue.substring(0, 13) === 'date and time') {
                let currentDate = new Date();
                let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
                $('#history').append(time + '<br/>');
            }
            else if (inputValue.substring(0, 4) === 'date') {
                let current = new Date();
                let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
                $('#history').append(cDate + '<br/>');
            }
            else if (inputValue.substring(0, 4) === 'year') {
                let currentDate = new Date();
                let cYear = currentDate.getFullYear()
                $('#history').append(cYear + '<br/>');
            }
            else if (inputValue.substring(0, 5) === 'month') {
                let currentDate = new Date();
                let cMonth = currentDate.getMonth() + 1
                $('#history').append(cMonth + '<br/>');
            }
            else if (inputValue.substring(0, 3) === 'day') {
                let currentDate = new Date();
                let cDay = currentDate.getDate()
                $('#history').append(cDay + '<br/>');
            }
            else if (inputValue.substring(0, 11) === 'bootcd-info') {
                $('#history').append('<br/>' + 'Hiren\'s BootCD PE is a versatile tool designed for diagnosing and repairing computer issues. It provides a collection of utilities that can be invaluable for various troubleshooting tasks. You can download it from the official website: <a href="https://www.hirensbootcd.org/download/" target="_blank">Download Hiren\'s BootCD PE</a>' + '<br/>' + '<br/>');
            }
            else if (inputValue.substring(0, 7) === 'bgcolor') {
                changeBackground($(this).val().substring(8));
            } 
            else if (inputValue.substring(0, 9) === 'textcolor') {
                changeTextColor($(this).val().substring(10));
            } 
            else if (inputValue.substring(0, 9) === 'linkcolor') {
                changeLinkColor($(this).val().substring(10));
            }
            else if (inputValue.substring(0, 11) === 'resetcolors') {
                resetColors();
                $('#history').append('Colors reset to default values.' + '<br/>');
            }
            else if (inputValue.substring(0, 4) === 'help') {
                $('#history').append('Commands: cd, clear, date, date and time, day, help, hi, month, time, year, hello, bootcd-info, bgcolor, textcolor, linkcolor, resetcolors' + '<br/>');
            }
            else if (inputValue.substring(0, 5) === 'clear') {
                $('#history').html('');
            } 
            else {
                $('#history').append('Command not found. Type "help" for a list of commands.' + '<br/>');
            }
            
            commandHistory.push($(this).val());
            historyIndex = commandHistory.length;

            // clear the input
            $('#input').val('');
            
            

        } else if (e.keyCode == 38) { // Up arrow key
            if (historyIndex > 0) {
                historyIndex--;
                $('#input').val(commandHistory[historyIndex]);
            }
        } else if (e.keyCode == 40) { // Down arrow key
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                $('#input').val(commandHistory[historyIndex]);
            } else {
                historyIndex = commandHistory.length;
                $('#input').val('');
            }
        }
    });
    function changeBackground(bgColor) {
        $('.terminal').css('background-color', bgColor);
        $('.terminal input').css('background-color', bgColor);
    }
    function changeTextColor(textColor) {
        $('.terminal').css('color', textColor);
    }
    function changeLinkColor(linkColor) {
        $('a').css('color', linkColor);
    }
    function resetColors() {
        $('.terminal').css('background-color', 'black');
        $('.terminal input').css('background-color', 'black');
        $('.terminal').css('color', 'white');
        $('a').css('color', '#007bff'); // Default link color (blue)
    }
});