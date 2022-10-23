function start(vendorId) {
	fetch('/vendors')
	.then(res => res.json())
	.then(vendors => {
		fetch('/orders')
        .then(res => res.json())
        .then(orders => {
            vendors.forEach(vendor => {
                vendor.orders = []
                vendor.averageOrderTotal = 0
                vendor.soldItems = {}
                orders.forEach(order => {
                    if (parseInt(order.vendorId) === vendor.id) {
                        vendor.averageOrderTotal += order.total
                        vendor.orders.push(order)

                        order.items.forEach(item => {
                            if (vendor.soldItems[item.itemData.name] !== undefined)
                                vendor.soldItems[item.itemData.name].amount += item.amount
                            else
                                vendor.soldItems[item.itemData.name] = {...item.itemData, amount: item.amount}
                        })
                    }
                })

                vendor.averageOrderTotal /= vendor.orders.length

            });
            const currentVendor = vendorId ? vendors.find(el => parseInt(vendorId) === el.id) : vendors[0]

            renderPage(currentVendor)

            document.getElementById("vendor-select").innerHTML = genSelList(vendors);
	        document.getElementById("vendor-select").onchange = (e) => {renderPage(vendors.find(el => parseInt(e.currentTarget.value) === el.id))};
            genSelList(vendors)
        })
    })
}

function renderPage(currentVendor) {
    const mostPopularItem = Object.values(currentVendor.soldItems).reduce((a, b) => {
        return a.amount > b.amount ? a : b;
    }, -Infinity)

    var template = document.getElementById('template').innerHTML;

    var rendered = mustache.render(template, {
        currentVendor: currentVendor,
        mostPopularItem: mostPopularItem
    });

    document.getElementById('main').innerHTML = rendered;
}

function genSelList(vendors) {
	let result = '<select name="vendor-select" id="vendor-select">';
	vendors.forEach(elem => {
		result += `<option value="${elem.id}">${elem.name}</option>`
	});
	result += "</select>";
	return result;
}

start()