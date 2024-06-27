var macros = [
    {id: 'protein', label: 'Protein Goal (g)', goal: 150, min: 0, max: 300},
    {id: 'carb', label: 'Carbohydrate Goal (g)', goal: 150, min: 0, max: 1000},
    {id: 'fat', label: 'Fat Goal (g)', goal: 100, min: 0, max: 300}
];
macros.push({id: 'calories', label: 'Calories Goal (kcal)', goal: macros[0].goal *4 + macros[1].goal* 4 + macros[2].goal * 9, min: 0, max: 4000});

const byName = {
    protein: 0,
    carb: 1,
    fat: 2,
    calories: 3,
    meals: 4
};


const form = d3.select('#macro-form');

// Create sliders dynamically
const sliders = form.selectAll('.slider-container')
    .data(macros)
    .enter().append('div')
    .attr('class', 'slider-container');

sliders.append('div')
    .attr('class', 'label-container')
    .each(function(d) {
        d3.select(this).append('span')
            .attr('class', 'label-text')
            .text(d => `${d.label}: ${d.goal}`);
    });

sliders.append('input')
    .attr('type', 'range')
    .attr('id', d => `${d.id}`)
    .attr('min', d => d.min)
    .attr('max', d => d.max)
    .attr('value', d => d.goal)
    .on('input', function(event, d) {
        synchronizeSliders(this, +this.value);
    });

function synchronizeSliders(obj, value) {

    // Update the data model

    console.log(obj.id);
    var before = [macros[0].goal, macros[1].goal, macros[2].goal, macros[3].goal];
    macros[byName[obj.id]].goal = value;
    var after = [macros[0].goal, macros[1].goal, macros[2].goal, macros[3].goal];
    var difference = [macros[0].goal - before[0], macros[1].goal - before[1], macros[2].goal - before[2], macros[3].goal - before[3]];

    var incrementVector = [
        difference[0], 
        difference [1] - difference[0] - difference[2]*9/4 + difference[3] / 4, 
        difference[2], 
        difference[1]*4 + difference[3]
        
    ];

    var results = [incrementVector[0] + before[0], incrementVector[1] + before[1], incrementVector[2] + before[2], incrementVector[3] + before[3]];
    
    
    macros[0].goal = results[0];
    macros[1].goal = results[1];
    macros[2].goal = results[2];
    macros[3].goal = results[3];
    
    console.log(before);
    console.log(after);
    console.log(difference);   
    console.log(incrementVector);
    console.log(results);
    console.log(results[0]*4 + results[1]*4 + results[2]*9);
    console.log(results[0]*4 + results[1]*4 + results[2]*9 - results[3]);


    // Update all sliders based on the data model
    d3.selectAll('input[type="range"]')
        .data(macros)  // Rebind the updated data
        .property('value', d => d.goal);  // Update the slider values

    // Update labels
    d3.selectAll('.label-text')
        .data(macros)  // Rebind the updated data
        .text(d => `${d.label}: ${d.goal}`);

}


// Initial update to ensure all sliders are in sync
synchronizeSliders(150);
