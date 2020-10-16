function bisnu(Bisnu) {
    return document.querySelector(Bisnu);
}
var CodiceFiscale = require('codice-fiscale-js');
const show_code = bisnu(".codice_fiscal");
const birth_date = bisnu(".birth_date");
const birth_place = bisnu(".birth_place");
const first_name = bisnu(".first_name");
const surname = bisnu(".surname");
const cal_btn = bisnu(".cal_btn");
const province = bisnu(".province");
var ele = document.getElementsByName('gender');
var sex;

let reg = /((^[^-]+)-([^-]+)-([0-9]+))/;
// Making Fiscale Code Start
cal_btn.addEventListener('submit', function (e) {
    e.preventDefault();
    // Radio button 
    for (i = 0; i < ele.length; i++) {
        if (ele[i].checked)
            sex = ele[i].value;
    }
    // Radio button end 

    let date_result = birth_date.value.match(reg)
    var cf = new CodiceFiscale({
        name: first_name.value,
        surname: surname.value,
        gender: sex,
        day: date_result[4],
        month: date_result[3],
        year: date_result[2],
        birthplace: birth_place.value,
        birthplaceProvincia: province.value, // Optional
    });
    show_code.innerHTML = cf.code;
    if (cf.birthplace.prov) {
        bisnu('.code_show_place').classList.add('code_show_place_block')
        console.log("okay")
        bisnu('.msg').style.display="block";
        bisnu('.msg').append('Codice Fiscale Ready');
    } else {
        bisnu('.msg').append('Something is wrong');
        bisnu('.msg').style.display="block";
        
    }
this.reset()

})
// Making Fiscale Code End

// ======================
//Fiscale code Data Show
const data_show_btn = bisnu(".data_show_btn");
const show_data_section = bisnu(".show_data");
const code_form = bisnu(".code_form");
const data_write_btn = bisnu(".data_write_btn");
const check_btn = bisnu(".check_btn");
const code_show = bisnu('.fiscale_code_show');
// form class select 
const birth_place_show = bisnu('.birth_place_show');
const birth_date_show = bisnu('.birth_date_show');
const gender_show_male = bisnu('.gender_show_male');
const gender_show_female = bisnu('.gender_show_female');
data_show_btn.addEventListener("click", function () {
    show_data_section.style.display = "block";
    code_form.style.display = "none";
})
check_btn.addEventListener('submit', function (e) {
    e.preventDefault();
    //BSNBNK20P29A089A
    var ds = new CodiceFiscale(code_show.value);
    var birthday = ds.toJSON().birthday;
    var birthplace = ds.toJSON().birthplace;
    var birthplaceProvincia = ds.toJSON().birthplaceProvincia;
    var gender = ds.toJSON().gender;
    birth_place_show.value=`${birthplace} (${birthplaceProvincia})`;
    birth_date_show.value=birthday;
    if(gender == 'M'){
        gender_show_male.checked=true
        gender_show_female.disabled=true
    }else if(gender == 'F'){
        gender_show_female.checked=true
        gender_show_male.disabled=true
    }
    
})

// Copy code start 
const btn_copy = bisnu(".btn_copy");
const code_copy = bisnu(".code_copy");
window.navigator.clipboard.writeText(code_copy.innerText);
btn_copy.onclick = function(){
    window.navigator.clipboard.writeText(code_copy.innerText);
    alert("Copy Successfully");
}
