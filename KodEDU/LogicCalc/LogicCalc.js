var editable = document.getElementById('English');
var guess = document.getElementById('Guess');
editable.addEventListener('input', function() {
    guess.innerHTML = editable.innerHTML.replace('not', '¬').replace('and', '∧').replace('or', '∨').replace('nor', '⊕').replace('xor', '⊕').replace('then', '→').replace('are', '→').replace('if and only if', '↔');
});