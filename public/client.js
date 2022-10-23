function start() {
	fetch('/vendors')
	.then(res => res.json())
	.then(data => {
		let vendors = data
		init(vendors)

	})
}

function genSelList(vendors) {
	let result = '<select name="vendor-select" id="vendor-select">';
	vendors.forEach(elem => {
		result += `<option value="${elem.id}">${elem.name}</option>`
	});
	result += "</select>";
	return result;
}

function init(vendors) {
	document.getElementById("vendor-select").innerHTML = genSelList(vendors);
	document.getElementById("vendor-select").onchange = () => selectVendor(vendors);
	selectVendor(vendors);
}

async function selectVendor(vendors) {
	let result = true;
	// //If order is not empty, confirm the user wants to switch vendors
	// if (!isEmpty(order)) {
	// 	result = confirm("Are you sure you want to clear your order and switch vendor?");
	// }

	//If switch is confirmed, load the new vendor data
	if (result) {
		let select = document.getElementById("vendor-select");

		//Get the selected index and set the current vendor
		let selected = select.options[select.selectedIndex].value;
		currentSelectIndex = select.selectedIndex;

		//In A2, current vendor will be data you received from the server
		const currentVendor = vendors.find(el => el.id === parseInt(selected));

		//Update the page contents to contain the new supply list
		document.getElementById("left").innerHTML = await getCategoryHTML(selected);
		document.getElementById("middle").innerHTML = await getSuppliesHTML(selected, currentVendor);

		//Clear the current oder and update the order summary
		order = {};
		updateOrder(currentVendor);

		//Update the vendor info on the page
		let info = document.getElementById("info");
		info.innerHTML = "<h1>" + currentVendor.name + "</h1>" + "<br>Minimum Order: $" + currentVendor.min_order + "<br>Delivery Fee: $" + currentVendor.delivery_fee + "<br><br>";
	} else {
		//If user refused the change of vendor, reset the selected index to what it was before they changed it
		let select = document.getElementById("vendor-select");
		select.selectedIndex = currentSelectIndex;
	}
}


//Given a vendor object, produces HTML for the left column
function getCategoryHTML(selected) {
	return new Promise ((resolve, reject) => {
		fetch('/vendors?id=' + selected)
		.then(res => res.json())
		.then(vend => {
			let supplies = vend.supplies;
			let result = "<h3>Categories</h3><br>";
			Object.keys(supplies).forEach(key => {
				result += `<a href="#${key}">${key}</a><br>`;
			});
			resolve(result);
		})
	})
}

//Given a vendor object, produces the supplies HTML for the middle column
function getSuppliesHTML(selected, currentVendor) {
	return new Promise ((resolve, reject) => {
		fetch('/vendors?id=' + selected)
		.then(res => res.json())
		.then(vend => {

			let supplies = vend.supplies;
			let result = "";
			//For each category in the supply list
			Object.keys(supplies).forEach(key => {
				result += `<b>${key}</b><a name="${key}"></a><br>`;
				//For each item in the category
				Object.keys(supplies[key]).forEach(id => {
					item = supplies[key][id];
					result += `${item.name} (\$${item.price}, stock=${item.stock}) <img src='add.png' style='height:20px;vertical-align:bottom;' onclick='addItem(${item.stock}, ${id}, ${currentVendor.id})'/> <br>`;
					result += item.description + "<br><br>";
				});
			});
			resolve(result);
		})
	})
}

//Reproduces new HTML containing the order summary and updates the page
//This is called whenever an item is added/removed in the order
function updateOrder(currentVendor) {
	let result = "";
	let subtotal = 0;
	//For each item ID currently in the order
	Object.keys(order).forEach(id => {
		//Retrieve the item from the supplies data using helper function
		//Then update the subtotal and result HTML
		let item = getItemById(id, currentVendor);
		subtotal += (item.price * order[id]);
		result += `${item.name} x ${order[id]} (${(item.price * order[id]).toFixed(2)}) <img src='remove.png' style='height:15px;vertical-align:bottom;' onclick='removeItem(${id}, ${currentVendor.id})'/><br>`;
	});

	//Add the summary fields to the result HTML, rounding to two decimal places
	result += `<br>Subtotal: \$${subtotal.toFixed(2)}<br>`;
	result += `Tax: \$${(subtotal * 0.1).toFixed(2)}<br>`;
	result += `Delivery Fee: \$${currentVendor.delivery_fee.toFixed(2)}<br>`;
	let total = subtotal + (subtotal * 0.1) + currentVendor.delivery_fee;
	result += `Total: \$${total.toFixed(2)}<br>`;

	//Decide whether to show the Submit Order button or the "Order X more" label
	if (subtotal >= currentVendor.min_order) {
		result += `<button type="button" id="submit" onclick="submitOrder('${currentVendor.id}', ${total})">Submit Order</button>`
	} else {
		result += `Add \$${(currentVendor.min_order - subtotal).toFixed(2)} more to your order.`;
	}

	document.getElementById("right").innerHTML = result;
}


//Helper function. Given an ID of an item in the current vendors' supply list, returns that item object if it exists.
function getItemById(id, currentVendor) {
	let categories = Object.keys(currentVendor.supplies);
	for (let i = 0; i < categories.length; i++) {
		if (currentVendor.supplies[categories[i]].hasOwnProperty(id)) {
			return(currentVendor.supplies[categories[i]][id]);
		}
	}
	return(null);
}

//Responsible for adding one of the items with given id to the order, updating the summary, and alerting if "Out of stock"
function addItem(stock, id, currentVendorId) {
	fetch('/vendors?id=' + currentVendorId)
	.then(res => res.json())
	.then(data => {
		let currentVendor = data
		if (order.hasOwnProperty(id) && (stock == order[id])){
			alert("Out if stock!");
			return;
		} else if (order.hasOwnProperty(id)) {
			order[id] += 1;
		} else {
			order[id] = 1;
		}
		updateOrder(currentVendor);
	})
}


function removeItem(id, currentVendorId) {
	fetch('/vendors?id=' + currentVendorId)
	.then(res => res.json())
	.then(data => {
	let currentVendor = data
	if (order.hasOwnProperty(id)) {
		order[id] -= 1;
		if (order[id] <= 0) {
			delete order[id];
		}
	}
	updateOrder(currentVendor);
	})
}


//For A2, you will likely make an XMLHttpRequest here
function submitOrder(currentVendorId, total) {
	fetch('/vendors?id=' + currentVendorId)
	.then(res => res.json())
	.then(currentVendor => {
		const orderData = {
			vendorId: currentVendorId,
			total: total,
			items: Object.keys(order).map(el => ({itemData: findSupply(currentVendor, el), amount: order[el]} ))
		}

		fetch('/place-order', {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {'Content-Type': 'application/json'},
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify(orderData)
		});
		alert("Order placed!");
		order = {};
		start();
	})
}


function findSupply (currentVendor, id) {
	const category = Object.values(currentVendor.supplies).find(el => Object.keys(el).includes(id))
	return category[id]
}

start()