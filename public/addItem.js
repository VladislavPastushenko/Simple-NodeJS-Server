function start() {
	fetch('/vendors')
	.then(res => res.json())
	.then(data => {
		let vendors = data
		init(vendors)
	})
}

function init(vendors) {
	document.getElementById("vendor-select").innerHTML = genSelVenList(vendors);
	document.getElementById("vendor-select").onchange = () => selectVendor(vendors);

    document.getElementById("submit-button").onclick = () => submit();

	selectVendor(vendors);
}


function genSelVenList(vendors) {
	let result = '<select name="vendorId" id="vendor-select">';
	vendors.forEach(elem => {
		result += `<option value="${elem.id}">${elem.name}</option>`
	});
	result += "</select>";
	return result;
}

function genSelCatList(currentVendor) {
	let result = '<select name="category" id="category-select">';
	Object.keys(currentVendor.supplies).forEach(elem => {
		result += `<option value="${elem}">${elem}</option>`
	});
	result += "</select>";
	return result;
}

async function selectVendor(vendors) {
	    //If switch is confirmed, load the new vendor data
		let select = document.getElementById("vendor-select");

		//Get the selected index and set the current vendor
		let selected = select.options[select.selectedIndex].value;
		currentSelectIndex = select.selectedIndex;

		//In A2, current vendor will be data you received from the server
		const currentVendor = vendors.find(el => el.id === parseInt(selected));

		document.getElementById("category-select").innerHTML = genSelCatList(currentVendor)
}


async function submit() {
    const values = {
        vendorId: document.getElementById("vendor-select").value,
        categoryName: document.getElementById("category-select").value,
        name: document.getElementById("name-input").value,
        description: document.getElementById("description-input").value,
        price: document.getElementById("price-input").value,
        stock: document.getElementById("stock-input").value,
    }

    fetch('/place-item', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(values)
    });
    alert("Order placed!");
    start()
}

start()