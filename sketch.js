//Create variables here
var canvas;
var dog, dogImg,happyDog ,happyDogImg,database, foodS, foodStock;
var feed, addFood;
var foodStock,lastFed,foodObj;
var gameState = 0;
var petCount;
var database;
var form,pet,game;
var bedRoomImg,deadDogImg,dogVaccinationImg,FoodStockImg,GardenImg,InjectionImg,LazyDogImg,LivingRoomImg;
var RunningDogImg,RunningLeftDogImg,VaccinationImg,WashroomImg;
var readState;

function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
  bedRoomImg = loadImage("images/BedRoom.png");
  deadDogImg = loadImage("images/deadDog.png");
  dogVaccinationImg = loadImage("images/dogVaccination.png");
  FoodStockImg = loadImage("images/FoodStock.png");
  GardenImg = loadImage("images/Garden.png");
  InjectionImg = loadImage("images/Injection.png");
  LazyDogImg = loadImage("images/Lazy.png");
  LivingRoomImg = loadImage("images/LivingRoom.png");
  RunningDogImg = loadImage("images/running.png");
  RunningLeftDogImg = loadImage("images/runningLeft.png");
  VaccinationImg = loadImage("images/Vaccination.jpg");
  WashroomImg = loadImage("images/WashRoom.png");
}

function setup() {
  canvas = createCanvas(600, 600);
  database = firebase.database();
  dog = createSprite(450,200);
  dog.addImage(dogImg);
  dog.scale = 0.2;
  foodStock=database.ref('Food');
  foodStock.on("value",readStock,showErr);



  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
    console.log(data.val())
  });
  

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  game = new Game();
  game.getState();
  game.start();
foodObj= new Food();

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
    console.log(gameState)
  })
 
}


function draw() {
  currentTime=hour();

  if(currentTime==(lastFed+1)){
    
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(dogImg);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  console.log(hour())
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
  
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}


function showErr(){
  console.log("Error in reading the database");
}
