<script setup>
import {ref, reactive} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const inpirationMessage = reactive({
  data: [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis\n" +
    "            tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit\n" +
    "            sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora\n" +
    "            torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac\n" +
    "            scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel\n" +
    "            bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.\n" +
    "            Curabitur tempor quis eros tempus lacinia. Nam bibendum pellentesque quam a convallis. Sed ut vulputate\n" +
    "            nisi. Integer in felis sed leo vestibulum venenatis. Suspendisse quis arcu sem. Aenean feugiat ex eu\n" +
    "            vestibulum vestibulum. Morbi a eleifend magna. Nam metus lacus, porttitor eu mauris a, blandit ultrices\n" +
    "            nibh. Mauris sit amet magna non ligula vestibulum eleifend. Nulla varius volutpat turpis sed lacinia. Nam\n" +
    "            eget mi in purus lobortis eleifend. Sed nec ante dictum sem condimentum ullamcorper quis venenatis nisi.\n" +
    "            Proin vitae facilisis nisi, ac posuere leo.",
    "Nam pulvinar blandit velit, id condimentum diam faucibus at. Aliquam lacus nisi, sollicitudin at nisi nec,\n" +
    "            fermentum congue felis. Quisque mauris dolor, fringilla sed tincidunt ac, finibus non odio. Sed vitae mauris\n" +
    "            nec ante pretium finibus. Donec nisl neque, pharetra ac elit eu, faucibus aliquam ligula. Nullam dictum,\n" +
    "            tellus tincidunt tempor laoreet, nibh elit sollicitudin felis, eget feugiat sapien diam nec nisl. Aenean\n" +
    "            gravida turpis nisi, consequat dictum risus dapibus a. Duis felis ante, varius in neque eu, tempor suscipit\n" +
    "            sem. Maecenas ullamcorper gravida sem sit amet cursus. Etiam pulvinar purus vitae justo pharetra consequat.\n" +
    "            Mauris id mi ut arcu feugiat maximus. Mauris consequat tellus id tempus aliquet.\n" +
    "            Vestibulum dictum ultrices elit a luctus. Sed in ante ut leo congue posuere at sit amet ligula. Pellentesque\n" +
    "            eget augue nec nisl sodales blandit sed et sem. Aenean quis finibus arcu, in hendrerit purus. Praesent ac\n" +
    "            aliquet lorem. Morbi feugiat aliquam ligula, et vestibulum ligula hendrerit vitae. Sed ex lorem, pulvinar\n" +
    "            sed auctor sit amet, molestie a nibh. Ut euismod nisl arcu, sed placerat nulla volutpat aliquet. Ut id\n" +
    "            convallis nisl. Ut mauris leo, lacinia sed elit id, sagittis rhoncus odio. Pellentesque sapien libero,\n" +
    "            lobortis a placerat et, malesuada sit amet dui. Nam sem sapien, congue eu rutrum nec, pellentesque eget\n" +
    "            ligula.",
    " Nunc tempor interdum ex, sed cursus nunc egestas aliquet. Pellentesque interdum vulputate elementum. Donec\n" +
    "            erat diam, pharetra nec enim ut, bibendum pretium tellus. Vestibulum et turpis nibh. Cras vel ornare velit,\n" +
    "            ac pretium arcu. Cras justo augue, finibus id sollicitudin et, rutrum eget metus. Suspendisse ut mauris eu\n" +
    "            massa pulvinar sollicitudin vel sed enim. Pellentesque viverra arcu et dignissim vehicula. Donec a velit ac\n" +
    "            dolor dapibus pellentesque sit amet at erat. Phasellus porttitor, justo eu ultrices vulputate, nisi mi\n" +
    "            placerat lectus, sed rutrum tellus est id urna. Aliquam pellentesque odio metus, sit amet imperdiet nisl\n" +
    "            sodales eu. Quisque viverra nunc nec vestibulum dapibus. Integer nec diam a libero tincidunt varius sed vel\n" +
    "            odio. Donec rutrum dapibus massa, vel tempor nulla porta id. Suspendisse vulputate fermentum sem\n" +
    "            sollicitudin facilisis. Aliquam vehicula sapien nec ante auctor, quis mollis leo tincidunt.\n" +
    "            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis\n" +
    "            tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit\n" +
    "            sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora\n" +
    "            torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac\n" +
    "            scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel\n" +
    "            bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.\n" +
    "         "
  ],
})
const dateAndTime = ref("21/02/2025 - 9:34 AM");

</script>

<template>
  <Headers/>
  <div class="p-4">
    <div class="d-flex gap-5">
      <div class="w-50">
        <div class="mt-2 p-0  boxReminder d-flex ">
          <div style="width: 60%" class="py-2 w-60 d-flex justify-content-around borderRightLine">
            <div class=" ps-4">
              <div>
                <div class="curretTemperature">75*F</div>
                <div class="normaltext">Feels like: 65*F</div>
              </div>
              <div class="d-flex flex-column">
                <div class="normaltext">Sunrise: 6:00AM</div>
                <div>
                  <img src="~/assets/img/timecurve.png" alt="timecurve">
                </div>
                <div class="normaltext">Sunset: 6:00PM</div>

              </div>
              <div></div>
            </div>
            <div class=" d-flex align-items-center justify-content-around flex-column">
              <div class="cityHead">San Francisco</div>
              <div>
                <img src="~/assets/img/noto_sun.png" alt="noto_sun">
              </div>
              <div class="cityHead">Sunny</div>
            </div>
          </div>
          <div style="width: 40%" class="p-2">
            <div class="d-flex align-items-center justify-content-around p-2 ">
              <div>
                <img src="~/assets/img/noto_sun-behind-cloud.png" alt="sun-behind-cloud"/>
              </div>
              <div class="temp">70°/50°</div>
              <div class="label">Tomorrow, 22/2</div>
            </div>
            <div class="d-flex align-items-center justify-content-around p-2 ">
              <div>
                <img src="~/assets/img/noto_sun-behind-cloud.png" alt="sun-behind-cloud"/>
              </div>
              <div class="temp">70°/50°</div>
              <div class="label">Tomorrow, 22/2</div>
            </div>
            <div class="d-flex align-items-center justify-content-around p-2 ">
              <div>
                <img src="~/assets/img/noto_sun-behind-cloud.png" alt="sun-behind-cloud"/>
              </div>
              <div class="temp">70°/50°</div>
              <div class="label">Tomorrow, 22/2</div>
            </div>
            <div class="d-flex align-items-center justify-content-around p-2 ">
              <div>
                <img src="~/assets/img/noto_sun-behind-cloud.png" alt="sun-behind-cloud"/>
              </div>
              <div class="temp">70°/50°</div>
              <div class="label">Tomorrow, 22/2</div>
            </div>
            <div class="d-flex align-items-center justify-content-around p-2 ">
              <div>
                <img src="~/assets/img/noto_sun-behind-cloud.png" alt="sun-behind-cloud"/>
              </div>
              <div class="temp">70°/50°</div>
              <div class="label">Tomorrow, 22/2</div>
            </div>
          </div>
        </div>
        <div class="mt-4 p-3 boxReminder ">
          <div class="d-flex justify-content-between align-items-center">
            <div class="title fs20"> Inspiration of the day!</div>
            <div class="label"> Generated at:
              <span>
                {{ dateAndTime }}
            </span>
            </div>
          </div>
          <hr/>
          <div v-for="(data,index)  of inpirationMessage.data" class="label mb-3 ">
            {{ data }}
          </div>
        </div>
      </div>
      <div class="w-50 mt-2">
        <div class="d-flex justify-content-between align-items-center ">
          <div class="lite-title">Reminders:10</div>
          <div class="d-flex gap-4">
            <button class="primarylite button ">Hide Completed</button>
            <button class="primaryBtn button">Create New</button>
          </div>
        </div>
        <div class="mt-4">
          <div class="my-3 boxReminder p-0">
            <div class="px-3 py-2  d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-3">
                <div><img src="~/assets/img/activeStar.png" alt="activeStar"/></div>
                <div class="normaltext">02/12/2025</div>
                <div class="todo">Todo</div>
              </div>
              <div class="d-flex align-items-center gap-4">
                <font-awesome-icon icon="fa-solid fa-trash"/>
                <font-awesome-icon icon="fa-solid fa-list-check"/>
                <font-awesome-icon icon="fa-solid fa-circle-check"/>
              </div>
            </div>
            <div class="borderBottomLine"></div>
            <div class="px-3 py-2 ">
              <div class="reminderTitle">
                oiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhg
              </div>
              <div class="normaltext">mnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjh</div>
            </div>
          </div>
          <div class="my-3 boxReminder p-0">
            <div class="px-3 py-2  d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-3">
                <div><img src="~/assets/img/activeStar.png" alt="activeStar"/></div>
                <div class="normaltext">02/12/2025</div>
                <div class="todo">Todo</div>
              </div>
              <div class="d-flex align-items-center gap-4">
                <font-awesome-icon icon="fa-solid fa-trash"/>
                <font-awesome-icon icon="fa-solid fa-list-check"/>
                <font-awesome-icon icon="fa-solid fa-circle-check"/>
              </div>
            </div>
            <div class="borderBottomLine"></div>
            <div class="px-3 py-2 ">
              <div class="reminderTitle">
                oiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhg
              </div>
              <div class="normaltext">mnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjh</div>
            </div>
          </div>
          <div class="my-3 boxReminder p-0">
            <div class="px-3 py-2  d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-3">
                <div><img src="~/assets/img/activeStar.png" alt="activeStar"/></div>
                <div class="normaltext">02/12/2025</div>
                <div class="todo">Todo</div>
              </div>
              <div class="d-flex align-items-center gap-4">
                <font-awesome-icon icon="fa-solid fa-trash"/>
                <font-awesome-icon icon="fa-solid fa-list-check"/>
                <font-awesome-icon icon="fa-solid fa-circle-check"/>
              </div>
            </div>
            <div class="borderBottomLine"></div>
            <div class="px-3 py-2 ">
              <div class="reminderTitle">
                oiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhg
              </div>
              <div class="normaltext">mnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjh</div>
            </div>
          </div>
          <div class="my-3 boxReminder p-0">
            <div class="px-3 py-2  d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-3">
                <div><img src="~/assets/img/activeStar.png" alt="activeStar"/></div>
                <div class="normaltext">02/12/2025</div>
                <div class="todo">Todo</div>
              </div>
              <div class="d-flex align-items-center gap-4">
                <font-awesome-icon icon="fa-solid fa-trash"/>
                <font-awesome-icon icon="fa-solid fa-list-check"/>
                <font-awesome-icon icon="fa-solid fa-circle-check"/>
              </div>
            </div>
            <div class="borderBottomLine"></div>
            <div class="px-3 py-2 ">
              <div class="reminderTitle">
                oiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhg
              </div>
              <div class="normaltext">mnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjh</div>
            </div>
          </div>
          <div class="my-3 boxReminder p-0">
            <div class="px-3 py-2  d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-3">
                <div><img src="~/assets/img/activeStar.png" alt="activeStar"/></div>
                <div class="normaltext">02/12/2025</div>
                <div class="todo">Todo</div>
              </div>
              <div class="d-flex align-items-center gap-4">
                <font-awesome-icon icon="fa-solid fa-trash"/>
                <font-awesome-icon icon="fa-solid fa-list-check"/>
                <font-awesome-icon icon="fa-solid fa-circle-check"/>
              </div>
            </div>
            <div class="borderBottomLine"></div>
            <div class="px-3 py-2 ">
              <div class="reminderTitle">
                oiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhgoiuygtfghjioijuhg
              </div>
              <div class="normaltext">mnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjhmnaiujikjuhghjh</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>