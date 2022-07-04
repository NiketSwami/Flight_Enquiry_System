$(document).ready(function(){
    
/* add  state name in dropdown addnewflightinterface */
    $.getJSON('/flight/fetchallstates',function(data){
    
        data.map((item)=>{
            $('#sourcestate').append($('<option>').text(item.statename).val(item.stateid))
            $('#destinationstate').append($('<option>').text(item.statename).val(item.stateid))

        })
        $('#sourcestate').formSelect();
        $('#destinationstate').formSelect();


        
    })
/* add city name in dropdown addnewflightinterface */
    $('#sourcestate').change(function(){
        $('#sourcecity').empty()
        $('#sourcecity').append($("<option disabled selected>").text('select your city'))
        $.getJSON('/flight/fetchallcity',{stateid:$('#sourcestate').val()},function(data){
            data.map((item)=>{
                $('#sourcecity').append($('<option>').text(item.cityname).val(item.cityid))
            })
            $('#sourcecity').formSelect();


        })
    })
    

    $('#destinationstate').change(function(){
        $('#destinationcity').empty()
        $('#destinationcity').append($("<option disabled selected>").text('select your city'))
        $.getJSON('/flight/fetchallcity',{stateid:$('#destinationstate').val()},function(data){
            data.map((item)=>{
                $('#destinationcity').append($('<option>').text(item.cityname).val(item.cityid))
            })
            $('#destinationcity').formSelect();


        })
    })
   
    $('#btn').click(function(){
        $.getJSON('/flight/searchflights',{sid:$('#sourcecity').val(),did:$('#destinationcity').val()},function(data){
            if(data.length==0){
                alert("Flight Not Exit......")
                $('#result').html("<h1><i>Flight Dose Not Exit......</i></h1>")
            }
            else{
                html=''
                html+=` <thead>
                <tr>
                    <th>Flight Id</th>
                    <th>Company Name</th>
                    <th>Source</th>
                    <th>Destination</th>
                    <th>Type</th>
                    <th>Class</th>
                    <th>Days</th>
                                    
                </tr>
              </thead>`
                data.map((item)=>{
                 html+=`
      
              <tbody>
            
                  <tr>
                      <td>${item.flightid}</td>
                      <th>${item.companyname}<br>
                            <img src="/images/${item.logo}" width="45">
                      </th>
                      <td>${item.sc}<br>${item.sourcetiming}</td>
                      <td>${item.dc}<br>${item.destinationtiming}</td>
                      <td>${item.status}</td>
                      <td>${item.flightclass}</td>
                      <td>${item.days}</td>
                      
                  }) 


                  </tr>
               
              </tbody>`
             
                })
               
                $('#result').html(html)   
            }
        })
    })

})