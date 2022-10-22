fetch('/vendors')
.then(res => res.json())
.then(data => {
	let vendors = data
	init(vendors)

})


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
		document.getElementById("middle").innerHTML = await getSuppliesHTML(selected);

		//Clear the current oder and update the order summary
		order = {};
		updateOrder();

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
function getSuppliesHTML(selected) {
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
					result += `${item.name} (\$${item.price}, stock=${item.stock}) <img src='add.png' style='height:20px;vertical-align:bottom;' onclick='addItem(${item.stock}, ${id})'/> <br>`;
					result += item.description + "<br><br>";
				});
			});
			resolve(result);
		})
	})
}