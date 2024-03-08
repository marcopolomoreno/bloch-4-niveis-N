//soma vetores

const { GPU } = require('gpu.js');
const gpu = new GPU();

const N = 5

//create vector with 1000 random numbers
const A = new Array(N).fill(0).map(() => Math.random());
const B = new Array(N).fill(0).map(() => Math.random());


gpu.addFunction(function somarVetores(a, b) {
    return a + b;
  });



const kernel = gpu.createKernel(function(a, b)
{
    const i = this.thread.x;

    return somarVetores(a[i], b[i])
}).setOutput([N]);



console.log(kernel(A, B))