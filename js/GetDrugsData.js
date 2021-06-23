$( document ).ready(function() {
    function GetDrugsData() {
        $(function () {
            $.ajax({
                type: "GET",
                url: "./drugs_1.json", 
                data: '{}',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: OnSuccess,
                failure: function (response) {
                    console.log(response);
                },
                error: function (response) {
                    console.log(response);
                }
            });           
        });
        function GetUsersDetails(ele) {
            var dataRow = $('#tblCustomers').DataTable().row($(ele).closest('tr')).data();
            alert(dataRow.CustomerID);
        }
        function OnSuccess(response) {
            $('#table_id tfoot th').each( function () {
                var title = $(this).text();
                $(this).html( '<label>'+title+'</label><input id="'+title.replace(/\s/g, '')+'" type="text" placeholder="Search '+title+'" />' );
            } );
            $.fn.dataTable.ext.errMode = 'none';
            var t = $("#table_id").DataTable({
                bLengthChange: true,
                bFilter: true,
                bSort: false,
                bPaginate: true,
                data: response.Indications,
                columns: [
                    { "data": "Indication" },
                    { "data": "Trade_Name" },
                    { "data": "Active_ingredient" },
                    { "data": "ICD_Code" },

                    { "data": "Drug_Class" },
                    { "data": "Drug_Sub_Class" },
                    { "data": "G_or_B" },
                    { "data": "Strength" },
                    { "data": "ATC_Code" },
                    { "data": "Dosage_Form" },
                    { "data": "Quantity_Limit_Adults" },
                    { "data": "ROA" },
                    { "data": "Registration_Number" },
                    { "data": "Notes_1" },
                    { "data": "Notes_2" },
                    { "data": "Appendix" }
                ],
                "columnDefs": [ {
                    "targets": 16,
                    "data": null,
                    "defaultContent": "<button type='button' class='viewD'><img src='./img/viewD.svg' /></button>"
                } ],
                initComplete: function () {
                    // Apply the search
                    this.api().columns().every( function () {
                        var that = this;
                        
                        $( 'input', that.footer() ).on( 'keyup change clear', function () {
                            $('.drugsLoader').show();
                            $('#table_id tbody').hide();
                            setTimeout(function(){
                                $('.drugsLoader').hide();
                                $('#table_id tbody').show();
                            }, 300)
                            if ( that.search() !== this.value ) {
                                that
                                    .search( this.value )
                                    .draw();
                            }
                        } );
                    } );
                    $('.dataTables_filter').html("")
                    $(".dataTables_info").detach().appendTo('.dataTables_filter');
                    $('#table_id tfoot tr').append( "<button type='button' class='initSearch'><img src='./img/search.svg' /> Search</button>" );
                }
            });
            $('.initSearch').click(function(){
                $('.drugsLoader').show();
                $('#table_id tbody').hide();
                setTimeout(function(){
                    $('.drugsLoader').hide();
                    $('#table_id tbody').show();
                }, 300)
            })
            $('#table_id tbody').on( 'click', 'button', function () {
                var cellNum = $(this).parent("td").parent("tr").find('td');
                $('.drugs-details').html(`
                <div>
                <h3>${cellNum.eq(1).html() ? cellNum.eq(1).html() : '...'}</h3>
                    <button type='button' id="close_drugs_details">x</button>
                </div>
                <ul>
                    <li><strong>Indication</strong> <span>${cellNum.eq(0).html() ? cellNum.eq(0).html() : '...'}</span></li>
                    <li><strong>ICD Code</strong> <span>${cellNum.eq(3).html() ? cellNum.eq(3).html() : '...'}</span></li>
                    <li><strong>Drug Class</strong> <span>${cellNum.eq(4).html() ? cellNum.eq(4).html() : '...'}</span></li>
                    <li><strong>Drug Sub Class</strong> <span>${cellNum.eq(5).html() ? cellNum.eq(5).html() : '...'}</span></li>
                    <li><strong>G or B</strong> <span>${cellNum.eq(6).html() ? cellNum.eq(6).html() : '...'}</span></li>
                    <li><strong>Strength</strong> <span>${cellNum.eq(7).html() ? cellNum.eq(7).html() : '...'}</span></li>
                    <li><strong>ATC Code</strong> <span>${cellNum.eq(8).html() ? cellNum.eq(8).html() : '...'}</span></li>
                    <li><strong>Active ingredient</strong> <span>${cellNum.eq(2).html() ? cellNum.eq(2).html() : '...'}</span></li>
                    <li><strong>Dosage Form</strong> <span>${cellNum.eq(9).html() ? cellNum.eq(9).html() : '...'}</span></li>
                    <li><strong>Quantity Limit Adults</strong> <span>${cellNum.eq(10).html() ? cellNum.eq(10).html() : '...'}</span></li>
                    <li><strong>ROA</strong> <span>${cellNum.eq(11).html() ? cellNum.eq(11).html() : '...'}</span></li>
                    <li><strong>Registration Number</strong> <span>${cellNum.eq(12).html() ? cellNum.eq(12).html() : '...'}</span></li>
                    <li><strong>Notes 1</strong> <span>${cellNum.eq(13).html() ? cellNum.eq(13).html() : '...'}</span></li>
                    <li><strong>Notes 2</strong> <span>${cellNum.eq(14).html() ? cellNum.eq(14).html() : '...'}</span></li>
                    <li><strong>Appendix</strong> <span>${cellNum.eq(15).html() ? '<a target="_blank" href="PDF/' + cellNum.eq(15).html() + '.pdf"><img src="./img/pdf.svg" /></a>' : '...'}</span></li>
                </ul>
                `)
                $('.drugs-overLayer').show();
                $('.drugs-details').show();
                $('#close_drugs_details').click(function() {
                    $('.drugs-details').hide();
                    $('.drugs-overLayer').hide();
                })
            } );
            var Indication = []
            for (var i = 0; i < 40460; i++) {
                if (response.Indications[i].Indication != response.Indications[i+1].Indication && response.Indications[i].Indication != undefined && response.Indications[i].Indication.length != 0) {
                    Indication.push(response.Indications[i].Indication)
                }
            }
            var indicationList = ""

            for (i=0; i < Indication.length; i++) {
                indicationList += "<option value='" + Indication[i]+ "'>" + Indication[i] + "</option>";
            }

            $('#table_id tfoot tr th:nth-child(1)').append("<select id='selectIndication'><option value='Indication List'>Indication List</option>" + indicationList + "</select>")
            $( "#Indication" ).autocomplete({
                source: Indication
            });

            $("#selectIndication").change(function() {
                $("#Indication").val($(this).val());
                var table = $( '#table_id' ).DataTable();
                table.search($(this).val()).draw();
            })
        };
    };
    GetDrugsData();
});
