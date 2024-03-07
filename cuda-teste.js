//soma vetores

const { GPU } = require('gpu.js');
const gpu = new GPU();

const A = [1, 2, 3, 4, 5]
const B = [2, 4, 6, 8, 9]


gpu.addFunction(function somarVetores(a, b) {
    return a + b;
  });



const kernel = gpu.createKernel(function(a, b)
{
    const i = this.thread.x;

    return somarVetores(a[i], b[i])
}).setOutput([5]);



console.log(kernel(A, B))



