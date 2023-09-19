var countdownNumberEl = document.getElementById('countdown-number');
var countdown = 30;

countdownNumberEl.textContent = countdown;

setInterval(function() {
  countdown = --countdown <= 0 ? 30 : countdown;

  countdownNumberEl.textContent = countdown;
}, 1000);


function formatNumberWithCommas(number) {
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function formatSavings(last, sell) {
    const savings = sell - last;
    const formattedSavings = formatNumberWithCommas(savings);
    return `▼ ₹ ${formattedSavings}`;
}


let count =0;
const arr = ["WazirX","Bitbns","Coldax","Zebpay","CoinDCX"]

function fetchDataAndUpdateTable() {
    fetch('https://crypto-fz0b.onrender.com/update')
        .then((response) => response.json())
        .then((data) => {
            const tableBody = document.getElementById('crypto-data-table');
            tableBody.innerHTML = '';

            console.log(data);
            // console.log(response)
            const l = data.length
            data.forEach((crypto) => {
                count++;
                const { name, last, buy, sell,volume,base_unit} = crypto;

                // Calculate difference and savings
                const difference = ((parseFloat(buy) - parseFloat(sell)) / parseFloat(sell) * 100).toFixed(2);
                const savings = (parseFloat(sell) - parseFloat(last)).toFixed(2);

                


                const symbol = savings >= 0 ? '▲' : '▼'

                // Create a new row in the table
                const row = document.createElement('tr');
                

                row.innerHTML = `
                    <td>${count}</td>
                    <td>${base_unit}</td>
                    <td>${name}</td>
                    <td>${last}</td>
                    <td>${buy} / ${sell}</td>
                    <td>${volume}%</td>
                    <td>${symbol} ${savings}</td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch((error) => console.error(error));
}

// Fetch and update data initially
fetchDataAndUpdateTable();

// Fetch and update data every 5 minutes (adjust this interval as needed)
setInterval(fetchDataAndUpdateTable, 300000);