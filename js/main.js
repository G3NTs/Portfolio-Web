let sliderBar = document.querySelector(".scrollmenu__slider__bar");
let items = [   document.querySelector(".scrollmenu__item--1"),
                document.querySelector(".scrollmenu__item--2"),
                document.querySelector(".scrollmenu__item--5"),
                document.querySelector(".scrollmenu__item--6"),
                document.querySelector(".scrollmenu__item--3"),
                document.querySelector(".scrollmenu__item--4")];

let ScrollActive = false;

items.forEach((item, index) => {
    item.onclick = function(){
        ScrollActive = true;
        item.classList.add("active");
        
        for (let i = 0; i < items.length; i++) {
            console.log(i);
            console.log(index);
            if (i != index) {
                console.log("runs");
                items[i].classList.remove("active");
            }
        }
        setTimeout(function() {
            console.log("Timeout function executed!");
            ScrollActive = false;
          }, 1000); // 3000 milliseconds = 3 seconds
    };
});


// manages the color change of the following buttons on hover. uses the mouse position.

const buttons = document.querySelectorAll(".projects__menu ul li");
const clips = document.querySelectorAll(".clip");

console.log(buttons);

buttons.forEach((button, index) => {
    let target = button.querySelector(".target");
    let scale = 0; // Initial scale value
    let isHovering = false; // Flag to track if mouse is hovering over the button
    let clip = button.querySelector('.clip'); // Assuming .clip is a previous sibling

    console.log("foreach");

    button.onclick = function(){
        console.log(button);
        console.log(clip);
        if (button.classList.contains("activated")) {
            button.classList.remove("activated");
            if (clip) clip.classList.remove("activated"); // Check if clip exists
            hideList(); 
        } else {
            button.classList.add("activated");
            if (clip) clip.classList.add("activated"); // Check if clip exists
        }

        console.log("button pressed");

        for (let i = 0; i < buttons.length; i++) {
            if (i != index) {
                buttons[i].classList.remove("activated");
                clips[i].classList.remove("activated");
            }
        }

        updateCardStyles();
    };
    

    function handleMove(e){
        var rect = button.getBoundingClientRect();
        const x = 27 + (e.pageX - button.offsetLeft - 50);
        const y = -45 + (e.pageY - (rect.top + window.scrollY) - 50);
        console.log("mouse on page: " + rect.top);
        console.log("butten offset: " + button.offsetTop);

        target.style.setProperty('--x',`${ x }px`);
        target.style.setProperty('--y',`${ y }px`);
    }

    function scaleUp() {
        // Increase scale over time if hovering
        if (isHovering && scale < 8) {
            scale += 0.07; // Adjust this value to control the speed of scaling
            target.style.setProperty('--scale',`${ scale }`);
        } else if (!isHovering && scale > 0) {
            // Reset scale if not hovering
            scale -= 0.07;
            target.style.setProperty('--scale',`${ scale }`);
        } else if (!isHovering && scale <= 0) {
            resetPositionAndScale()
        }
        requestAnimationFrame(scaleUp);
    }

    function handleMouseEnter() {
        isHovering = true;
    }
    
    function handleMouseLeave() {
        isHovering = false;
    }

    function resetPositionAndScale() {
        scale = 0; // Reset scale
        target.style.removeProperty('--x');
        target.style.removeProperty('--y');
        target.style.setProperty('--scale',`${ scale }`);
    }

    button.addEventListener('mousemove', (e) => {
        console.log("hovering over button");
        handleMove(e);
        handleMouseEnter();
    });

    button.addEventListener('touchmove', (e) => {
        console.log("hovering over button");
        handleMove(e.changedTouches[0]);
        handleMouseEnter();
    });

    button.addEventListener('mouseleave', () => {
        handleMouseLeave();
        console.log("mouseleave");
    });

    button.addEventListener('touchend', () => {
        handleMouseLeave();
        console.log("touchend");
    });

    scaleUp();
});

// Manages the slider

const wrapper = document.querySelector(".projects__display");
const carousel = document.querySelector(".carousel");
const cardWidth = carousel.querySelector(".projects__card").offsetWidth;
const cards = carousel.querySelectorAll(".projects__card");
const arrowBtns = document.querySelectorAll(".projects__slider__button__left__inner, .projects__slider__button__right__inner");
const carouselChildren = [...carousel.children];
const displayWidth = document.querySelector(".projects__display").offsetWidth;
// Calculate the center of the carousel

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

let cardPerView = Math.round(carousel.offsetWidth / cardWidth);

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id == "left" ? -cardWidth : cardWidth;
    });
});

// Records the initial cursor and scroll position of the carousel when dragging starts
const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

// Updates the scroll position of the carousel based on the cursor movement
const dragging = (e) => {
    if(!isDragging) {
        return;
    } else {
        carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
    }
}

// manages the and of dragging the carousel
const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

// if the carousel is at the beginning, scroll to the end & vice versa.
const infiniteScroll = () => {
    if(carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

// Autoplay the carousel after every 2500 ms
const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return;
    timeoutId = setTimeout(() => carousel.scrollLeft += cardWidth, 2500);
}

//autoPlay();

function initializeCarousel(children){
    console.log("initializing Carousel");
    carousel.scrollLeft = 0;

    // Center the cards when there are fewer than 5 cards present
    const totalCardWidth = children * cardWidth;
    if (totalCardWidth < carousel.offsetWidth) {
        carousel.style.justifyContent = "center";
    } else {
        carousel.style.justifyContent = "flex-start";
    }
}

// Function to update card styles based on their position relative to the center of the carousel
function updateCardStyles(){
    cards.forEach(card => {
        //const carouselCenter = -(cardWidth / 2) + ((cardWidth * 2) / 2);
        const carouselCenter = displayWidth / 2 - cardWidth / 2;
        const inner = card.querySelector(".projects__card__inner");
        // Calculate the distance of the card from the center of the carousel
        const distanceFromCenter = Math.abs(card.offsetLeft - carouselCenter - carousel.scrollLeft);
        console.log("card offset: " + (card.offsetLeft - carouselCenter - 20));
    
        // Calculate scale based on distance from the center
        const scale = Math.round(100 - (distanceFromCenter / (carouselCenter * 8)) * 100) / 100;
    
        // Apply styles to the card
        inner.style.transform = `scale(${scale})`;
    });
};

carousel.classList.add("no-transition");
initializeCarousel(6);
updateCardStyles();
carousel.classList.remove("no-transition");

carousel.addEventListener("mousedown", (e) => {
    dragStart(e);
    console.log("drag Start");
});
carousel.addEventListener("mousemove", (e) => {
    dragging(e);
    console.log("dragging");
});
document.addEventListener("mouseup", () => {
    dragStop();
    console.log("drag Stop");
});
// Add event listener for scrolling the carousel
carousel.addEventListener("scroll", () => {
    updateCardStyles();
});
// Call the updateCardStyles function initially and on window resize
window.addEventListener("resize", () => {
    initializeCarousel(carouselChildren.length);
    updateCardStyles();
});
// Call the updateCardStyles function initially and on window resize
//window.addEventListener("resize", updateCardStyles());
// Add event listeners for scrolling the carousel
//carousel.addEventListener("scroll", updateCardStyles());
// carousel.addEventListener("scroll", () => {
//    infiniteScroll();
//   console.log("infinite Scroll");
//});
//wrapper.addEventListener("mouseenter", () => {
//    clearTimeout(timeoutId);
//});
// wrapper.addEventListener("mouseleave", () => {
//     autoPlay();
// });


////////////////////////////////////////////////////////



//================== Sort List =======================//

function sortList(category){
    console.log("sorting");
    var list, i, switching, listitems, shouldSwitch;
    list = document.getElementById("list1");
    switching = true;

    while(switching){
        switching = false;
        listitems = list.getElementsByTagName("li");

        for(i = 0; i < listitems.length - 1; i++){
            shouldSwitch = false;
            if(listitems[i].innerHTML.toLowerCase() > listitems[i + 1].innerHTML.toLowerCase()){
                shouldSwitch = true;
                break;
            }
        }
        listitems[i].parentNode.insertBefore(listitems[i + 1], listitems[i]);
        switching = true;
    }
}

function hideList(category){
    console.log("Hiding cards without category:", category);
    
    // Get all list items
    var listItems = document.querySelectorAll("#list1 .projects__card");

    let children = 0;

    if(!category){
        listItems.forEach(function(item) {
                            item.style.display = "block";
                            children += 1;
        });
        initializeCarousel(children);
    } else {
        // Loop through each list item
            listItems.forEach(function(item) {
                // Check if the item contains the specified category
                var itemCategories = item.querySelectorAll(".fa-solid");
                var found = false;
                itemCategories.forEach(function(cat) {
                    if (cat.classList.contains("fa-" + category)) {
                        found = true;
                    }
                });
        
                // Hide or show the item based on the category
                if (found) {
                    item.style.display = "block";
                    children += 1;
                } else {
                    item.style.display = "none";
                }
            });
            initializeCarousel(children);
    }
}







// const container = document.getElementById('container');
// const items2 = document.querySelectorAll('.skills__tools__grid__tool');

// const itemsPerRow = 7; // Number of items per row in the middle
// const totalItems = items2.length; // Total number of items

// // Calculate the number of items on the first and last rows
// const middleRowCount = itemsPerRow;
// console.log(middleRowCount);
// let firstRowCount = Math.ceil((totalItems % itemsPerRow) / 2);
// console.log(firstRowCount);
// let lastRowCount = Math.floor((totalItems % itemsPerRow) / 2);
// console.log(lastRowCount);

// // Create invisible placeholder items at the beginning of each row
// function spawnPlaceholder(location, rowCount){
//   const placeholder = document.createElement("div");
//   //placeholder.classList.add("skills__tools__grid__tool");
//   placeholder.classList.add("placeholder");
//   placeholder.style.visibility = "hidden";
//   container.insertBefore(placeholder, items2[location]);
//   //placeholder.style.flex = `1 0 calc((100% / 2) - (${rowCount} * 80px))`
//   let calculatedWidth = (parseFloat(getComputedStyle(container).width) - (rowCount * 90)) / 2 - 5;
//   placeholder.style.width = `${calculatedWidth}px`;
//   console.log(calculatedWidth);
//   console.log(parseFloat(getComputedStyle(container).width));
// };

// spawnPlaceholder(0,firstRowCount);
// spawnPlaceholder(0 + firstRowCount,firstRowCount);
// spawnPlaceholder(totalItems - lastRowCount,lastRowCount);
// spawnPlaceholder(totalItems + 3,lastRowCount)


// const container = document.getElementById('container');
// const items2 = document.querySelectorAll('.skills__tools__grid__tool');

// const totalItems = items2.length; // Total number of items

// // Function to calculate the number of items on the first and last rows
// function calculateRowCounts() {
//     let itemsPerRow = Math.floor(parseFloat(getComputedStyle(container).width) / 90); // Number of items per row in the middle
//     let firstRowCount = Math.ceil((totalItems % itemsPerRow) / 2);
//     let lastRowCount = Math.floor((totalItems % itemsPerRow) / 2);
//     return { itemsPerRow, firstRowCount, lastRowCount };
// }

// // Function to create a placeholder
// function createPlaceholderTop(location) {
//     const placeholdertop = document.createElement("div");
//     placeholdertop.classList.add("placeholder");
//     placeholdertop.style.visibility = "hidden";
//     container.insertBefore(placeholdertop, items2[location]);
//     return placeholdertop;
// }

// // Function to create a placeholder
// function createPlaceholderBottom(location) {
//     const placeholderbottom = document.createElement("div");
//     placeholderbottom.classList.add("placeholder");
//     placeholderbottom.style.visibility = "hidden";
//     container.insertBefore(placeholderbottom, items2[location]);
//     return placeholderbottom;
// }

// // Function to update placeholder width
// function updatePlaceholderWidth(placeholdertop, placeholderbottom) {
//     const { firstRowCount, lastRowCount } = calculateRowCounts();
//     const calculatedWidthTop = (parseFloat(getComputedStyle(container).width) - (firstRowCount * 90)) / 2 - 5;
//     const calculatedWidthBottom = (parseFloat(getComputedStyle(container).width) - (lastRowCount * 90)) / 2 - 5;

//     placeholdertop.style.width = `${calculatedWidthTop}px`;
//     placeholderbottom.style.width = `${calculatedWidthBottom}px`;
// }

// // Create placeholders initially and store them in arrays
// const placeholdersTop = [];
// const placeholdersBottom = [];
// const { firstRowCount, lastRowCount } = calculateRowCounts();
// placeholdersTop.push(createPlaceholderTop(0, firstRowCount));
// placeholdersTop.push(createPlaceholderTop(0, firstRowCount));
// placeholdersBottom.push(createPlaceholderBottom(totalItems - 1, lastRowCount));
// placeholdersBottom.push(createPlaceholderBottom(totalItems + 3, lastRowCount));

// // Create a ResizeObserver instance
// const resizeObserver = new ResizeObserver(entries => {
//     for (let entry of entries) {
//         if (entry.target === container) {
//             // Update the placeholder width when the container size changes
//             updatePlaceholderWidth(placeholdersTop[0], placeholdersBottom[0]);
//         }
//     }
// });

// // Observe the container for size changes
// resizeObserver.observe(container);





const container = document.getElementById('container');
const items2 = document.querySelectorAll('.skills__tools__grid__tool');

let placeholdersTop = []; // Array to store top placeholders
let placeholdersBottom = []; // Array to store bottom placeholders
let placeholdersTop2 = []; // Array to store bottom placeholders
let placeholdersBottom2 = []; // Array to store bottom placeholders
let totalItems = items2.length; // Total number of items

// Function to calculate the number of items on the first and last rows
function calculateRowCounts() {
    let itemsPerRow = Math.floor((parseFloat(getComputedStyle(container).width)) / 110); // Number of items per row in the middle
    let firstRowCount = Math.ceil((totalItems % itemsPerRow) / 2);
    let lastRowCount = Math.floor((totalItems % itemsPerRow) / 2);
    let secondRowCount = itemsPerRow;
    let secondLastRowCount = itemsPerRow;

    console.log("rows filled: " + totalItems / itemsPerRow);
    if (totalItems / itemsPerRow >= 2) {
        if (firstRowCount < itemsPerRow - 7) {
            firstRowCount += 4;
            secondRowCount = itemsPerRow - 4;
        } else if (firstRowCount < itemsPerRow - 5) {
            firstRowCount += 2;
            secondRowCount = itemsPerRow - 2;
        } else if (firstRowCount < itemsPerRow - 3) {
            firstRowCount += 1;
            secondRowCount = itemsPerRow - 1;
        }
        if (lastRowCount < itemsPerRow - 7) {
            lastRowCount += 4;
            secondLastRowCount = itemsPerRow - 4;
        } else if (lastRowCount < itemsPerRow - 6) {
            lastRowCount += 2;
            secondLastRowCount = itemsPerRow - 2;
        } else if (lastRowCount < itemsPerRow - 3) {
            lastRowCount += 1;
            secondLastRowCount = itemsPerRow - 1;
        }
    } else if (totalItems / itemsPerRow < 1.9) {
        firstRowCount += lastRowCount;
        lastRowCount = 0; 
    }
    console.log("first= " + firstRowCount);
    console.log("second= " + secondRowCount);
    console.log("second to last= " + secondLastRowCount);
    console.log("last= " + lastRowCount);
    console.log("per row= " + itemsPerRow)
    return { itemsPerRow, firstRowCount, lastRowCount, secondRowCount, secondLastRowCount};
}

// Function to create a placeholder at the top
function createPlaceholder(location) {
    const placeholdertop = document.createElement("div");
    placeholdertop.classList.add("placeholder");
    placeholdertop.style.visibility = "hidden";
    container.insertBefore(placeholdertop, items2[location]);
    return placeholdertop;
}


// Function to move the placeholders to the specified location
function movePlaceholderTop(placeholders, location) {
    const placeholder1 = placeholders[0];
    const placeholder2 = placeholders[1];
    
    // Remove placeholders from their current positions
    if (placeholder1.parentNode) {
        placeholder1.parentNode.removeChild(placeholder1);
    }
    if (placeholder2.parentNode) {
        placeholder2.parentNode.removeChild(placeholder2);
    }

    container.insertBefore(placeholder1, items2[0]);
    container.insertBefore(placeholder2, items2[location]);
}

function movePlaceholderBottom(placeholders, location) {
    const placeholder3 = placeholders[0];
    const placeholder4 = placeholders[1];
    
    // Remove placeholders from their current positions
    if (placeholder3.parentNode) {
        placeholder3.parentNode.removeChild(placeholder3);
    }
    if (placeholder4.parentNode) {
        placeholder4.parentNode.removeChild(placeholder4);
    }

    container.insertBefore(placeholder3, items2[totalItems - location]);
    container.insertBefore(placeholder4, items2[totalItems]);
}

// Function to move the placeholders to the specified location
function movePlaceholderTop2(placeholders, location, location2) {
    const placeholder5 = placeholders[0];
    const placeholder6 = placeholders[1];
    
    // Remove placeholders from their current positions
    if (placeholder5.parentNode) {
        placeholder5.parentNode.removeChild(placeholder5);
    }
    if (placeholder6.parentNode) {
        placeholder6.parentNode.removeChild(placeholder6);
    }

    container.insertBefore(placeholder5, items2[location]);
    container.insertBefore(placeholder6, items2[location2]);
}

function movePlaceholderBottom2(placeholders, location, location2) {
    const placeholder7 = placeholders[0];
    const placeholder8 = placeholders[1];
    
    // Remove placeholders from their current positions
    if (placeholder7.parentNode) {
        placeholder7.parentNode.removeChild(placeholder7);
    }
    if (placeholder8.parentNode) {
        placeholder8.parentNode.removeChild(placeholder8);
    }

    container.insertBefore(placeholder7, items2[location]);
    container.insertBefore(placeholder8, items2[location2]);
}



// Function to update placeholder width
function updatePlaceholderWidth() {
    let {itemsPerRow, firstRowCount, lastRowCount, secondRowCount, secondLastRowCount } = calculateRowCounts();
    
    let calculatedWidthBottom = ((parseFloat(getComputedStyle(container).width)) - (lastRowCount * 110)) / 2;
    let calculatedWidthTop2 = ((parseFloat(getComputedStyle(container).width)) - (secondRowCount * 110)) / 2;
    let calculatedWidthTop = ((parseFloat(getComputedStyle(container).width)) - (firstRowCount * 110)) / 2;
    let calculatedWidthBottom2 = ((parseFloat(getComputedStyle(container).width)) - (secondLastRowCount * 110)) / 2;

    if (calculatedWidthBottom2 < 45) {
        calculatedWidthBottom2 = 0;
    }
    if (calculatedWidthTop2 < 45) {
        calculatedWidthTop2 = 0;
    }

        //console.log(parseFloat(getComputedStyle(container).width));

        placeholdersBottom.forEach(placeholder => {
            placeholder.style.width = `${calculatedWidthBottom}px`;
        });
        placeholdersTop2.forEach(placeholder => {
            placeholder.style.width = `${calculatedWidthTop2}px`;
        });
        placeholdersTop.forEach(placeholder => {
            placeholder.style.width = `${calculatedWidthTop}px`;
        });
        placeholdersBottom2.forEach(placeholder => {
            placeholder.style.width = `${calculatedWidthBottom2}px`;
        });
}

// Create placeholders initially
let {itemsPerRow, firstRowCount, lastRowCount, secondRowCount, secondLastRowCount } = calculateRowCounts();

    placeholdersBottom2.push(createPlaceholder(totalItems - lastRowCount - secondLastRowCount));
    placeholdersBottom2.push(createPlaceholder(totalItems - lastRowCount));
    placeholdersBottom.push(createPlaceholder(totalItems - lastRowCount));
    placeholdersBottom.push(createPlaceholder(totalItems));

    placeholdersTop.push(createPlaceholder(0));
    placeholdersTop.push(createPlaceholder(firstRowCount));
    placeholdersTop2.push(createPlaceholder(firstRowCount));
    placeholdersTop2.push(createPlaceholder(firstRowCount + secondRowCount));

// Create a ResizeObserver instance
const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        if (entry.target === container) {
            console.log("updating grid");
            // Update the position and width of the placeholders when the container size changes
            let { firstRowCount, lastRowCount, secondRowCount, secondLastRowCount } = calculateRowCounts();

                movePlaceholderBottom2(placeholdersBottom2, totalItems - lastRowCount - secondLastRowCount, totalItems - lastRowCount);
                movePlaceholderBottom(placeholdersBottom, lastRowCount);
            
                movePlaceholderTop(placeholdersTop, firstRowCount);
                movePlaceholderTop2(placeholdersTop2, firstRowCount, firstRowCount + secondRowCount);
            
            updatePlaceholderWidth();
        }
    }

    var container = document.getElementById('container');
    var containerRect = container.getBoundingClientRect();

    var backgroundLists = document.querySelectorAll('.backgroundList');
    backgroundLists.forEach(function(backgroundList) {
        var parentTool = backgroundList.closest('.skills__tools__grid__tool');
        var parentToolRect = parentTool.getBoundingClientRect();

        var heightModified = containerRect.height * 3;
        console.log("the height is: " + heightModified);

        // Set dimensions
        backgroundList.style.width = (containerRect.width) + 'px';
        backgroundList.style.height = (heightModified) + 'px';

        // Set position
        var xOffset = containerRect.left - parentToolRect.left;
        var yOffset = containerRect.top - parentToolRect.top;

        backgroundList.style.transform = 'translate(' + (xOffset) + 'px, ' + (yOffset) + 'px)';
    });
});

// Observe the container for size changes
resizeObserver.observe(container);

///////////////////////////////////////////////////////////////////////////////////

window.addEventListener('load', function() {
    var container = document.getElementById('container');
    var containerRect = container.getBoundingClientRect();

    var backgroundLists = document.querySelectorAll('.backgroundList');
    backgroundLists.forEach(function(backgroundList) {
        let parentTool = backgroundList.closest('.skills__tools__grid__tool');
        let parentToolRect = parentTool.getBoundingClientRect();

        var heightModified = containerRect.height * 3;
        console.log("the height is: " + heightModified);

        // Set dimensions
        backgroundList.style.width = (containerRect.width) + 'px';
        backgroundList.style.height = (heightModified) + 'px';

        // Set position
        var xOffset = containerRect.left - parentToolRect.left;
        var yOffset = containerRect.top - parentToolRect.top;

        console.log("top of the container: " + containerRect.top);
        backgroundList.style.transform = 'translate(' + (xOffset) + 'px, ' + (yOffset) + 'px)';
    });
});

///////////////////////////////////////////////////////////////////////////////////

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const delay = entry.target.dataset.delay || 0;
        //console.log(delay);
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.animate({
                    opacity: 1, filter: 'blur(' + 0 + 'px)', transform: 'translateY(' + 0 + 'px)'
                },{ 
                    duration: 1000, fill: 'forwards' 
                });
            }, delay);
        } else {
            setTimeout(() => {
                entry.target.animate({
                    opacity: 0, filter: 'blur(' + 5 + 'px)', transform: 'translateY(' + 30 + 'px)'
                },{ 
                    duration: 1000, fill: 'forwards' 
                });
            }, delay);
        }
    });
});

const hiddenElements = document.querySelectorAll('.fade-in-base');
hiddenElements.forEach((el) => observer.observe(el));

/////////////////////////////////////////////////////////////////////////////////////

const scrollElements = document.querySelectorAll('.scroll');

window.addEventListener('scroll', () => {
    let bounds = scrollElements[0].getBoundingClientRect();
    if ((bounds.top < window.innerHeight) && (bounds.top > -600)) {
        let distanceToBottom = window.innerHeight - bounds.top; // Distance to bottom of viewport
        let scrollPosition = Math.max(0, Math.min(1, distanceToBottom / (window.innerHeight + 500)));
        let translateYValue = -scrollPosition * 500 - 50;

        scrollElements.forEach((el) => {
            el.animate({
                transform: 'translateY(' + translateYValue + 'px)' 
            },{ 
                duration: 1000, fill: 'forwards' 
            });
        });
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////

const observer2 = new IntersectionObserver((entries2) => {
    entries2.forEach((entry2) => {
        const delay2 = entry2.target.dataset.delay || 0;
        const width2 = entry2.target.dataset.width || '10%';
        //console.log(delay2);
        if (entry2.isIntersecting) {
            setTimeout(() => {
                entry2.target.animate({
                    //opacity: 1,
                    width: width2
                },{ 
                    duration: 1000, fill: 'forwards' 
                });
            }, delay2);
        } else {
            setTimeout(() => {
                entry2.target.animate({
                    //opacity: 0,
                    width: 0
                },{ 
                    duration: 1000, fill: 'forwards' 
                });
            }, delay2);
        }
    });
});

const hiddenElements2 = document.querySelectorAll('.scroll_left');
hiddenElements2.forEach((el2) => observer2.observe(el2));


document.body.style.setProperty(
    "--scrollbar-width",
    `${window.innerWidth - document.body.clientWidth}px`
);
document.body.style.setProperty(
    "--window-width",
    `${window.innerWidth}px`
);
document.body.style.setProperty(
    "--client-width",
    `${document.body.clientWidth}px`
);

//====================================================================

const windowMinusButtons = document.querySelectorAll('.minus');
const windowRestoreButtons = document.querySelectorAll('.restore');
const windowCloseButtons = document.querySelectorAll('.close');
const windowMainButton = document.querySelector('.ipad-button');

windowMinusButtons.forEach(minus => {
    minus.addEventListener("click", () => {
        const box = minus.closest('.box');
        box.classList.add("minature");
        console.log("clicked minus");
    });
});

windowRestoreButtons.forEach(restore => {
    restore.addEventListener("click", () => {
        const box = restore.closest('.box');
        box.classList.remove("minature");
        console.log("clicked restore");
    });
});

windowCloseButtons.forEach(close => {
    close.addEventListener("click", () => {
        const box = close.closest('.box');
        box.classList.add("transparent");
        console.log("clicked close");
    });
});

windowMainButton.addEventListener("click", () => {
    windowRestoreButtons.forEach(minus => {
        const box = minus.closest('.box');
        box.classList.remove("minature");
        box.classList.remove("transparent");
    });
    console.log("clicked main");
});

const expandButton = document.querySelector('.navbar__expand');
const navbarFace = document.querySelector('.navbar__face');
const navbarObject = document.querySelector('.navbar');
var navbarExpanded = false;

expandButton.onclick = function(){
    console.log("clicked the expand button");
    if(navbarExpanded){
        console.log("true");
        expandButton.classList.remove("expanded");
        navbarObject.classList.remove("expanded");
        navbarFace.classList.remove("expanded");
        navbarExpanded = false;
    } else {
        console.log("false");
        expandButton.classList.add("expanded");
        navbarObject.classList.add("expanded");
        navbarFace.classList.add("expanded");
        navbarExpanded = true;
    }
};

// Get all sections
const sections = document.querySelectorAll('.navbarSection');

window.addEventListener('scroll', function() {
    //console.log("scrolling");
    // find the section currently in view 
    let index2 = getSectionIndex(sections);

    // update navigation menu
    items.forEach((item, index) => {
        //console.log("item: " + index + ", and the active index:" + index2);
        if (index == index2 && ScrollActive == false){
            item.classList.add("active");
        } else if (ScrollActive == false) {
            item.classList.remove("active");
        }
    });
    const computedStyle = window.getComputedStyle(expandButton);
    let widthX = computedStyle.getPropertyValue('width');
    let widthX2 = - parseFloat(widthX) - (parseFloat(widthX) / 10);
    //console.log("width: " + parseFloat(widthX2));
    let heightX = computedStyle.getPropertyValue('height');
    let heightX2 = parseFloat(heightX);
    offset = index2 * (heightX2) + 5;
    //console.log("width: " + parseFloat(heightX2));
    sliderBar.style.transform = "translateX(" + widthX2 + "px) translateY("+ offset + "px)";
});

function getSectionIndex() {
    //console.log("Getting section ID");

    for (let index = 0; index < sections.length; index++) {
        const section = sections[index];
        const sectionRect = section.getBoundingClientRect();
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        //console.log("document scroll: " + window.scrollY);
        //console.log("section top: " + sectionRect.top + window.scrollY);
        //console.log("section height: " + sectionRect.height);
        //console.log("==============================");
        if (scrollY <= sectionRect.top + window.scrollY + 500) {
            //console.log("return=========================");
            return index;
        }
    }
    return 0; // Default to the first section if none are in view
};