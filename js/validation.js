function validate() {
    return !(!checkX() ||
        !checkRadio("\"y_value\"", "Введите значение Y") ||
        !checkRadio("\"r_value\"", "Введите значение R"));
}

function checkX() {
    const minValue = -5;
    const maxValue = 3;

    let xValue = document.form.x_value.value;
    if (xValue === '') {
        alert("Введите значение X");
        return false;
    }
    xValue = parseFloat(xValue.replace(",", "."));
    if (isNaN(xValue)) {
        alert("Некорректно введено значение X");
        return false;
    } else if (xValue < minValue || xValue > maxValue) {
        alert("Недопустимое значение X:\n" +
            `Минимальное значение: ${minValue} \n` +
            `Максимальное значение: ${maxValue}`);
        return false;
    }
    return true;
}

function checkRadio(radioName, errMessage) {
    if (document.querySelector(`input[name=${radioName}]:checked`) !== null) {
        return true;
    } else {
        alert(errMessage);
        return false;
    }
}

function getData() {
    let x = parseFloat(document.form.x_value.value.replace(",", "."));
    let y = parseInt(document.querySelector('input[name="y_value"]:checked').value, 10);
    let r = parseFloat(document.querySelector('input[name="r_value"]:checked').value);

    let load_all = tableIsEmpty()? 1 : 0;

    return {
        "x_value": x,
        "y_value": y,
        "r_value": r,
        "load_all": load_all
    };
}

function addTableRow(x, y, r, result, time, delta) {
    let tbody = $('.results').find('tbody')[0];
    let row = document.createElement("tr");

    let tdX = document.createElement("td");
    tdX.appendChild(document.createTextNode(x));

    let tdY = document.createElement("td");
    tdY.appendChild(document.createTextNode(y));

    let tdR = document.createElement("td");
    tdR.appendChild(document.createTextNode(r));

    let tdResult = document.createElement("td");
    tdResult.appendChild(document.createTextNode(result));

    let tdTime = document.createElement("td");
    tdTime.appendChild(document.createTextNode(time));

    let tdDelta = document.createElement("td");
    tdDelta.appendChild(document.createTextNode(delta));

    row.appendChild(tdX);
    row.appendChild(tdY);
    row.appendChild(tdR);
    row.appendChild(tdResult);
    row.appendChild(tdTime);
    row.appendChild(tdDelta);
    tbody.appendChild(row);
}

function addMultipleRows(rowArray) {
    for (let i = 0; i < rowArray.length; i++) {
        let data_row = rowArray[i];
        addTableRow(data_row[0], data_row[1], data_row[2], data_row[3], data_row[4], data_row[5]);
    }
}

function tableIsEmpty() {
    let rows_count = document.getElementById("results").rows.length;
    return rows_count === 1;
}

$(document).ready(function () {
    if(tableIsEmpty()) {
        $.ajax('server.php', {
            type: 'GET',
            data: {"load_all": 1},
            dataType: 'json',
            success: function (data) {
                addMultipleRows(data)
            },
            error: function () {
                alert("Упс, похоже на стороне сервера возникла ошибка :(");
            }
        });
    }

    $('.form').on("submit", function (event) {
        if (validate()) {
            event.preventDefault();
            let data = getData();

            $.ajax('server.php', {
                type: 'GET',
                data: data,
                dataType: 'json',
                success: function (data) {
                    addTableRow(data[0], data[1], data[2], data[3], data[4], data[5]);
                },
                error: function () {
                    alert("Упс, похоже на стороне сервера возникла ошибка :(");
                }
            });
        }
    });
});