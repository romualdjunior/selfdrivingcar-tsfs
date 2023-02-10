let network = '{"levels":[{"inputs":[0.09671858965695179,0.11489136469808348,0.33508979704852204,0.28030638243048656,0.20622513549533406],"outputs":[0,1,1,1,0,0],"biases":[0.570698230492822,-0.07363091620606524,-0.07295758020038476,-0.446528663758018,0.3665599011062267,0.07919392953210048],"weights":[[0.35805366335587696,0.29974604357967943,0.1226469007176221,0.6598000498335985,-0.11585707786106429,-0.45634003288153463],[0.7191564750451087,-0.14614668247528612,-0.19784043840657964,-0.2640126538013698,0.35549368215444666,0.23762601819085805],[-0.13035840718118474,0.06879001186686977,-0.31389459082536164,-0.18827312220366949,0.3350292891732701,-0.38370333245947225],[-0.5077583736615552,-0.4899957400683439,0.12701703204367193,-0.11082859514414146,-0.29187394800815,-0.43608195574929204],[-0.026850703560371305,0.14468501980762022,0.04091827601117551,0.3712501443767546,0.46549437487929973,-0.22885851654560596]]},{"inputs":[0,1,1,1,0,0],"outputs":[1,1,1,0],"biases":[-0.30242252868994646,0.4291292394650979,-0.4834785863612812,-0.07305870787183634],"weights":[[-0.15062620315857775,-0.24739892542721265,0.014333189017693546,-0.35576206581484987],[0.24763529139938978,0.02588267043965118,0.35107369601270205,0.10923725617285533],[0.10668425530209982,0.36565869586476385,0.026083900666102486,-0.370184290968097],[0.3898784468789818,0.17442444721888317,-0.558654568534692,0.05002684092331203],[0.5734837408356261,-0.2950424096881692,-0.23904763078578603,-0.2580626544780005],[-0.25428970532560524,0.4167203905486176,-0.3688297101605514,-0.4363414824181913]]}]}'

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];


if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(network);
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
}
console.log(localStorage.getItem("bestBrain"))
// console.log(bestCar)
bestCar.brain = JSON.parse(network)


const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -700, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),

];

animate();
// console.log(localStorage.getItem("bestBrain"))

function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
    console.log(localStorage.getItem("bestBrain"))

}

function discard() {
    localStorage.removeItem("bestBrain");
    console.log(localStorage.getItem("bestBrain"))

}

function generateCars(N) {
    const cars = [];
    for (let i = 1; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }
    bestCar = cars.find(
        c => c.y == Math.min(
            ...cars.map(c => c.y)
        ));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx);
    }
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}

function loadJSON(path, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                bestCar = JSON.parse(xhr.responseText);
                console.log("bestCar", bestCar)

            }
            else {
                error(xhr);
            }
        }
    };
    xhr.open('GET', path, true);
    xhr.send();
}

