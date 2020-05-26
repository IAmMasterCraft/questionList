// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBJzRzXvTn8qwbrqQZ9o8fcyVlgHO5cWhM",
  authDomain: "exam-76c31.firebaseapp.com",
  databaseURL: "https://exam-76c31.firebaseio.com",
  projectId: "exam-76c31",
  storageBucket: "exam-76c31.appspot.com",
  messagingSenderId: "131633256479",
  appId: "1:131633256479:web:ad446260fedb3da2c21d2a",
  measurementId: "G-HP3YXRS8XX",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();
const docRef = firestore.doc(
  "priority_courses/" +
    $(location).attr("href").split("?module=")[1].split("&course=")[1]
);

var availableQuestionList = [];
var collection = "";
var courseCode = "";
var errorStat = [];
var noQuestion = [
  "GAT201",
  "BUO192",
  "CIT101",
  "EHS206",
  "CSS131",
  "AFS202",
  "INR172",
  "FMS105",
  "INR152",
  "EHS211",
  "AGR202",
  "EHS212",
  "POL204",
  "ANP207",
  "ESM216",
  "ENG172",
  "CIT132",
  "GST102",
  "GST202",
  "GST105",
  "GST302",
  "GST104",
  "GST204",
  "GST205",
  "GST107",
  "GST707",
  "GST807",
  "GST101",
  "GST201",
  "GST103",
  "GST203",
];

Object.objsize = function (Myobj) {
  var osize = 0,
    key;
  for (key in Myobj) {
    if (Myobj.hasOwnProperty(key)) osize++;
  }
  return osize;
};

function getQuestions(selectedText, selectedCourse) {
  // var collection = selectedText.replace(/ /g, "_").toLowerCase();
  var link =
    "https://firestore.googleapis.com/v1beta1/projects/exam-76c31/databases/(default)/documents/" +
    collection +
    "/" +
    selectedCourse;

  $.ajax({
    type: "GET",
    url: link,
    success: function (result, status, xhr) {
      // console.log(result);
      for (let index = 1; index <= Object.objsize(result["fields"]); index++) {
        const element = result["fields"]["question" + index];
        // console.log(element['stringValue']);
        availableQuestionList.push(element["stringValue"]);
        errorStat.push("No errors");
      }
    },
    error: function() {
      if (
        noQuestion.includes(
          $(location).attr("href").split("?module=")[1].split("&course=")[1]
        )
      ) {
        $(".spanError").text(
          "No questions available on " +
            $(location).attr("href").split("?module=")[1].split("&course=")[1]
        );
      }
      $("#notAvailable").show(function () {
        docRef.set({
          notAvailable:
            new Date() +
            " for " +
            $(location).attr("href").split("?module=")[1].split("&course=")[0],
        });
      });
      $(".pleaseWait").hide();
    }
  });
}

function appendAvailableCourse(courseList) {
  if (courseList.length == 10) {
    $("#questions").prepend(
      "<h1 class='col-md-6 col-lg-12 text-center'>" +
        courseCode +
        " " +
        collection.replace(/_/g, " ").toUpperCase() +
        "</h1>"
    );
    for (let index = 0; index < courseList.length; index++) {
      const element = courseList[index];
      var process = element
        .replace(/ \[op/g, "")
        .replace(/op\] /g, "")
        .replace(/\n/g, "<br>");
      process = process.split(" @@@ ");
      var htmlElement =
        '<div class="row"><div class="col-md-6 col-lg-12 text-left"><h3>' +
        (index + 1) +
        ")." +
        process[0] +
        "</h3><h4>" +
        process[1] +
        "<br><b>Ans: " +
        process[2] +
        "</b></h4></div></div><span style='float:right; color:red; font-weight: bold; opacity:0.5;'>@IAmMasterCraft</span><hr>";
      $("#questions").append(htmlElement);
      $(".pleaseWait").hide();
      $("#notAvailable").hide();
      $("#questions").show();
    }
  } 
}

function searchForCourse(myCourseCodeInput) {
  var courseCodeInput = myCourseCodeInput.replace(/ /, "");
  if (
    courseCodeInput.length == 6 &&
    $.isNumeric(courseCodeInput.substring(3, courseCodeInput.length))
  ) {
    window.location.href =
      $(location)
        .attr("href")
        .replace(/[A-Za-z]{3}[0-9]{3}/, "") + courseCodeInput.toUpperCase();
  } else {
    alert(
      myCourseCodeInput +
        " is an invalid Course Code \nCourse Code Format: ABC123"
    );
  }
}

// interval for available data
var dataClick = setInterval(checkDataList, 3000);

function checkDataList() {
  if (availableQuestionList.length > 0) {
    clearInterval(dataClick);
    appendAvailableCourse(availableQuestionList);
  }
}

// var loadError = setTimeout(myErr, 3000);
function myErr() {
  if (
    noQuestion.includes(
      $(location).attr("href").split("?module=")[1].split("&course=")[1]
    )
  ) {
    $(".pleaseWait").hide();
    $(".spanError").text(
      "No questions available on " +
        $(location).attr("href").split("?module=")[1].split("&course=")[1]
    );
    $("#notAvailable").show();
    return false;
  }
  if (availableQuestionList.length == 0) {
    $("#notAvailable").show(function () {
      docRef.set({
        notAvailable:
          new Date() +
          " for " +
          $(location).attr("href").split("?module=")[1].split("&course=")[0],
      });
    });
    $(".pleaseWait").hide();
  }
}

$(document).ready(function () {
  $(".pleaseWait").show();
  var presentUrl = $(location).attr("href");
  try {
    collection = presentUrl.split("?module=")[1].split("&course=")[0];
    courseCode = presentUrl.split("?module=")[1].split("&course=")[1];
    getQuestions(collection, courseCode);
  } catch (error) {
    console.log(error);
    alert("Invalid course code");
    $("body").hide();
  }
});
