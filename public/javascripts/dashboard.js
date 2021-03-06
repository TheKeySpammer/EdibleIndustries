function removeSearchResult() {
    $('.dropdown-menu .dropdown-content').empty();
    $('.dropdown-menu').hide();
}

$(function () {
    $("#rented-table").DataTable({
        "columnDefs": [
            { "width": "3%", "targets": 0 },
        ],
        "order": [[0, 'desc']],
        "footerCallback": function (row, data, start, end, display) {
            var api = this.api(),
                data;
            var intVal = function (i) {
                if (typeof i === 'string') {
                    i = i.trim();
                    if (i.length == 0) {
                        return 0;
                    }
                    if (isNaN(i)) {
                        i = i.substring(3);
                        return parseFloat(i);
                    }
                    return parseFloat(i);
                }
                return i;
            };

            // computing column Total of the complete result 
            var costTotal = api
                .column(5, { search:'applied' })
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            var total = api
                .column(4, { search:'applied' })
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            costTotal = formatMoney(costTotal);

            // Update footer by showing the total with the reference of the column index 
            $(api.column(0).footer()).html('Total');
            $(api.column(5).footer()).html('Re. '+costTotal);
            $(api.column(4).footer()).html(total);
        }
    });
    $("#unpaid-table").DataTable({
        "columnDefs": [
            { "width": "3%", "targets": 0 },
        ],
        "order": [[0, 'desc']],
        "footerCallback": function (row, data, start, end, display) {
            var api = this.api(),
                data;
            var intVal = function (i) {
                if (typeof i === 'string') {
                    i = i.trim();
                    if (i.length == 0) {
                        return 0;
                    }
                    if (isNaN(i)) {
                        i = i.substring(3);
                        return parseFloat(i);
                    }
                    return parseFloat(i);
                }
                return i;
            };

            // computing column Total of the complete result 
            var costTotal = api
                .column(4, { search:'applied' })
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            costTotal = formatMoney(costTotal);

            // Update footer by showing the total with the reference of the column index 
            $(api.column(0).footer()).html('Total');
            $(api.column(4).footer()).html('Re. '+costTotal);
        }
    });
    

    $("#month-sale").on('change', function() {
        var dt = $(this).val();
        $.get('/api/stats/month-sale?date='+dt, function(data) {
            $("#month-sale-value").html(`
                <span style="font-size: 1rem;">Re.</span> ${data.total}
            `);
        }).fail(function(err) {
            console.log(err);
            $("#month-sale-value").html('N/A');
        });
    });

    $.get('/api/all-customers', function (data) {
        if (data.status == 'success') {
            const customers = data.customers;
            function searchCustomer(obj) {
                $('#customer-dropdown-menu .dropdown-content').empty();
                $("#customer-dropdown-menu").show();
                var query = $(obj).val();
                var result = [];
                if (query.length > 0) {
                    for (let i = 0; i < customers.length; i++) {
                        const customer = customers[i];
                        if (customer.detail.search(query) >= 0) {
                            result.push(customer);
                            if (result.length > 5) break;
                        }
                    }
                    if (result.length == 0) {
                        var res = $('<a href="#" class="dropdown-item">No Match</a>');
                        $('#customer-dropdown-menu .dropdown-content').append(res);
                    } else {

                        for (let i = 0; i < result.length - 1; i++) {
                            let r = result[i];
                            var res = $('<a href="/customer/' + r.id + '" class="dropdown-item is-capitalized">' + r.detail + '</a><hr class="dropdown-divider">');
                            $('#customer-dropdown-menu .dropdown-content').append(res);
                        }
                        let r = result[result.length - 1];
                        var res = $('<a href="/customer/' + r.id + '" class="dropdown-item is-capitalized">' + r.detail + '</a>');
                        $('#customer-dropdown-menu .dropdown-content').append(res);
                    }
                }
            }
            $("#customer-search").on('focus', function () {
                searchCustomer(this);
            });
            $("#customer-search").on('keyup', function () {
                searchCustomer(this);
            });
        }
    }).fail(function (err) {
        console.log(err);
    });


    $(document).on('keyup', function (e) {
        var code;
        if (e.key !== undefined) {
            code = e.key;
        } else if (e.keyIdentifier !== undefined) {
            code = e.keyIdentifier;
        }
        if (code === 'Escape') {
            removeSearchResult();
        }
    });

    $(document).on('click', function (e) {
        if (!$(e.target).hasClass('dropdown')) {
            if ($(e.target).parents('.dropdown').length == 0) {
                removeSearchResult();
            }
        }
    });
});