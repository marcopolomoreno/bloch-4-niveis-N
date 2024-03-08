fs = require('fs');
const { GPU } = require('gpu.js');
const gpu = new GPU();

const nome_arquivo = '/dados.txt'

const path = __dirname + `${nome_arquivo}`

function escreverArquivo(caminho,texto){
    fs.writeFile(caminho, texto, function(error){
        if (error){
            console.error('erro de escrita' + error.message)
        } else {
            console.log('Escrito com sucesso em '+ caminho)
        }
    })
}

dados = "delta rho11 rho22 rho33 rho44 soma a12 b12 a13 b13 a14 b14 a23 b23 a24 b24 a34 b34\n" + "ns\n"


gpu.addFunction(function bloch(rho11, rho22, rho33, rho44, a12, b12, a13, b13, a14, b14, a23, b23, a24, b24, a34, b34, j)
{
    const pi = Math.PI;

    let delta21 = 0,
        delta31 = 0,
        delta41 = 0,
        delta32 = 0,
        delta42 = 0,
        delta43 = 0;

    const gamma22 = 2*pi*5e6,
          gamma44 = 2*pi*5e6,
          gamma12 = 0.5*gamma22,
          gamma13 = 0,
          gamma14 = 0.5*gamma44,
          gamma23 = 0.5*gamma22,
          gamma24 = 0.5*(gamma22 + gamma44),
          gamma34 = 0.5*gamma44;

    let A = 1*gamma22,
        B = 0.1*gamma22;

    if (j===1)  return 2*A*b12 + 0.5*gamma22*rho22 + 0.5*gamma44*rho44;

    if (j===2)  return -2*A*b12 + 2*B*b23 - gamma22*rho22;

    if (j===3)  return 2*A*b34 - 2*B*b23 + 0.5*gamma22*rho22 + 0.5*gamma44*rho44;
 
    if (j===4)  return -2*A*b34 - gamma44*rho44;

    //a12
    if (j===5)  return -gamma12*a12 - delta21*b12 + B*b13;

    //b12
    if (j===6)  return -gamma12*b12 + delta21*a12 + (rho22-rho11)*A - B*a13;

    //a13
    if (j===7)  return -gamma13*a13 - delta31*b13 + A*b14 - A*b23 + B*b12;

    //b13
    if (j===8)  return -gamma13*b13 + delta31*a13 - A*a14 + A*a23 - B*a12;

    //a14
    if (j===9)  return -gamma14*a14 - delta41*b14 + A*b13 - A*b24;

    //b14
    if (j===10) return -gamma14*b14 + delta41*a14 - A*a13 + A*a24;

    //a23
    if (j===11) return -gamma23*a23 - delta32*b23 - A*b13 + A*b24;

    //b23
    if (j===12) return -gamma23*b23 + delta32*a23 + A*a13 - A*a24 + (rho33-rho22)*B;

    //a24
    if (j===13) return -gamma24*a24 - delta42*b24 - A*b14 + A*b23 - B*b34;

    //b24
    if (j===14) return -gamma24*b24 + delta42*a24 + A*a14 - A*a23 + B*a34;

    //a34
    if (j===15) return -gamma34*a34 - delta43*b34 - B*b24;

    //b34
    if (j===16) return -gamma34*b34 + delta43*a34 + B*a24 - (rho33-rho44)*A;
})



/* function solucaoTempo()
{
    for (var k=0; k<=1000; k++)
    {
        for (var j=1; j<=16; j++)
            k1[j] = bloch(rho11, rho22, rho33, rho44, a12, b12, a13, b13, a14, b14, a23, b23, a24, b24, a34, b34, j);
    
        for (var j=1; j<=16; j++)
            k2[j] = bloch(rho11 + 0.5*h*k1[1], rho22 + 0.5*h*k1[2], rho33 + 0.5*h*k1[3], rho44 + 0.5*h*k1[4], 
                            a12 + 0.5*h*k1[5],  b12 + 0.5*h*k1[6],  a13 + 0.5*h*k1[7],  b13 + 0.5*h*k1[8], 
                            a14 + 0.5*h*k1[9],  b14 + 0.5*h*k1[10], a23 + 0.5*h*k1[11], b23 + 0.5*h*k1[12], 
                            a24 + 0.5*h*k1[13], b24 + 0.5*h*k1[14], a34 + 0.5*h*k1[15], b34 + 0.5*h*k1[16], j);
    
        for (var j=1; j<=16; j++)
            k3[j] = bloch(rho11 + 0.5*h*k2[1], rho22 + 0.5*h*k2[2], rho33 + 0.5*h*k2[3], rho44 + 0.5*h*k2[4],
                            a12 + 0.5*h*k2[5],  b12 + 0.5*h*k2[6],  a13 + 0.5*h*k2[7],  b13 + 0.5*h*k2[8], 
                            a14 + 0.5*h*k2[9],  b14 + 0.5*h*k2[10], a23 + 0.5*h*k2[11], b23 + 0.5*h*k2[12], 
                            a24 + 0.5*h*k2[13], b24 + 0.5*h*k2[14], a34 + 0.5*h*k2[15], b34 + 0.5*h*k2[16], j);
    
        for (var j=1; j<=16; j++)
            k4[j] = bloch(rho11 + h*k3[1], rho22 + h*k3[2], rho33 + h*k3[3], rho44 + h*k3[4],
                            a12 + h*k3[5],  b12 + h*k3[6],  a13 + h*k3[7],  b13 + h*k3[8], 
                            a14 + h*k3[9],  b14 + h*k3[10], a23 + h*k3[11], b23 + h*k3[12], 
                            a24 + h*k3[13], b24 + h*k3[14], a34 + h*k3[15], b34 + h*k3[16], j);
    
        rho11 = rho11 + (h/6)*(k1[1] + 2*k2[1] + 2*k3[1] + k4[1]);
        rho22 = rho22 + (h/6)*(k1[2] + 2*k2[2] + 2*k3[2] + k4[2]);
        rho33 = rho33 + (h/6)*(k1[3] + 2*k2[3] + 2*k3[3] + k4[3]);
        rho44 = rho44 + (h/6)*(k1[4] + 2*k2[4] + 2*k3[4] + k4[4]);
    
        soma = rho11 + rho22 + rho33 + rho44;
    
        a12 = a12 + (h/6)*(k1[5]  + 2*k2[5]  + 2*k3[5]  + k4[5]);
        b12 = b12 + (h/6)*(k1[6]  + 2*k2[6]  + 2*k3[6]  + k4[6]);
        a13 = a13 + (h/6)*(k1[7]  + 2*k2[7]  + 2*k3[7]  + k4[7]);
        b13 = b13 + (h/6)*(k1[8]  + 2*k2[8]  + 2*k3[8]  + k4[8]);
        a14 = a14 + (h/6)*(k1[9]  + 2*k2[9]  + 2*k3[9]  + k4[9]);
        b14 = b14 + (h/6)*(k1[10] + 2*k2[10] + 2*k3[10] + k4[10]);
        a23 = a23 + (h/6)*(k1[11] + 2*k2[11] + 2*k3[11] + k4[11]);
        b23 = b23 + (h/6)*(k1[12] + 2*k2[12] + 2*k3[12] + k4[12]);
        a24 = a24 + (h/6)*(k1[13] + 2*k2[13] + 2*k3[13] + k4[13]);
        b24 = b24 + (h/6)*(k1[14] + 2*k2[14] + 2*k3[14] + k4[14]);
        a34 = a34 + (h/6)*(k1[15] + 2*k2[15] + 2*k3[15] + k4[15]);
        b34 = b34 + (h/6)*(k1[16] + 2*k2[16] + 2*k3[16] + k4[16]);
    
        t = t + h;
    
        if (k%10000 === 0)
        {
            console.log(t*1e9, rho11, rho22, rho33, rho44, soma)
            dados = dados + 1e9*t + " " + rho11 + " " + rho22 + " " + rho33 + " " + rho44 + " " + soma + " " + a12 + " " + b12 + " " + a13 + " " + b13 + " " + a14 + " " + b14 + " " + a23 + " " + b23 + " " + a24 + " " + b24 + " " + a34 + " " + b34 + "\n"
        }
    }
} */



let rho11 = [], rho22 = [], rho33 = [], rho44 = [], soma;
let a12 = [], b12 = [], a13 = [], b13 = [], a14 = [], b14 = [];
let a23 = [], b23 = [], a24 = [], b24 = [], a34 = [], b34 = [];
let t = 0;
let h = 0.1e-12

const N = 1000;

//Condições iniciais
//put 0.5 value in all element of rho11 vector
rho11 = new Array(N).fill(0.5);
rho22 = new Array(N).fill(0);
rho33 = new Array(N).fill(0.5);
rho44 = new Array(N).fill(0);

a12 = new Array(N).fill(0);
b12 = new Array(N).fill(0);
a13 = new Array(N).fill(0);
b13 = new Array(N).fill(0);
a14 = new Array(N).fill(0);
b14 = new Array(N).fill(0);
a23 = new Array(N).fill(0);
b23 = new Array(N).fill(0);
a24 = new Array(N).fill(0);
b24 = new Array(N).fill(0);
a34 = new Array(N).fill(0);
b34 = new Array(N).fill(0);


//console.log(t*1e9, rho11, rho22, rho33, rho44, a12, b12, a13, b13, a14, b14, a23, b23, a24, b24, a34, b34)


const kernel = gpu.createKernel(function(rho11, rho22, rho33, rho44, a12, b12, a13, b13, a14, b14, a23, b23, a24, b24, a34, b34)
{
    const i = this.thread.x;

    let k1 = [0, 0, 0, 0]

    //k1[0] = 2
    k1[1] = 2

    
    //emptyArray = emptyArray.push(5)



/*     for (var k=0; k<=1000; k++)
    {
        for (var j=1; j<=16; j++)
            k1[j] = bloch(rho11[i], rho22[i], rho33[i], rho44[i], a12[i], b12[i], a13[i], b13[i], 
                        a14[i], b14[i], a23[i], b23[i], a24[i], b24[i], a34[i], b34[i], j);
    
        for (var j=1; j<=16; j++)
            k2[j] = bloch(rho11[i] + 0.5*h*k1[1], rho22[i] + 0.5*h*k1[2], rho33[i] + 0.5*h*k1[3], rho44[i] + 0.5*h*k1[4], 
                            a12[i] + 0.5*h*k1[5],  b12[i] + 0.5*h*k1[6],  a13[i] + 0.5*h*k1[7],  b13[i] + 0.5*h*k1[8], 
                            a14[i] + 0.5*h*k1[9],  b14[i] + 0.5*h*k1[10], a23[i] + 0.5*h*k1[11], b23[i] + 0.5*h*k1[12], 
                            a24[i] + 0.5*h*k1[13], b24[i] + 0.5*h*k1[14], a34[i] + 0.5*h*k1[15], b34[i] + 0.5*h*k1[16], j);
    
        for (var j=1; j<=16; j++)
            k3[j] = bloch(rho11[i] + 0.5*h*k2[1], rho22[i] + 0.5*h*k2[2], rho33[i] + 0.5*h*k2[3], rho44[i] + 0.5*h*k2[4],
                            a12[i] + 0.5*h*k2[5],  b12[i] + 0.5*h*k2[6],  a13[i] + 0.5*h*k2[7],  b13[i] + 0.5*h*k2[8], 
                            a14[i] + 0.5*h*k2[9],  b14[i] + 0.5*h*k2[10], a23[i] + 0.5*h*k2[11], b23[i] + 0.5*h*k2[12], 
                            a24[i] + 0.5*h*k2[13], b24[i] + 0.5*h*k2[14], a34[i] + 0.5*h*k2[15], b34[i] + 0.5*h*k2[16], j);
    
        for (var j=1; j<=16; j++)
            k4[j] = bloch(rho11[i] + h*k3[1], rho22[i] + h*k3[2], rho33[i] + h*k3[3], rho44[i] + h*k3[4],
                            a12[i] + h*k3[5],  b12[i] + h*k3[6],  a13[i] + h*k3[7],  b13[i] + h*k3[8], 
                            a14[i] + h*k3[9],  b14[i] + h*k3[10], a23[i] + h*k3[11], b23[i] + h*k3[12], 
                            a24[i] + h*k3[13], b24[i] + h*k3[14], a34[i] + h*k3[15], b34[i] + h*k3[16], j);
    
        rho11[i] = rho11[i] + (h/6)*(k1[1] + 2*k2[1] + 2*k3[1] + k4[1]);
        rho22[i] = rho22[i] + (h/6)*(k1[2] + 2*k2[2] + 2*k3[2] + k4[2]);
        rho33[i] = rho33[i] + (h/6)*(k1[3] + 2*k2[3] + 2*k3[3] + k4[3]);
        rho44[i] = rho44[i] + (h/6)*(k1[4] + 2*k2[4] + 2*k3[4] + k4[4]);
    
        //soma = rho11[i] + rho22[i] + rho33[i] + rho44[i];
    
        a12[i] = a12[i] + (h/6)*(k1[5]  + 2*k2[5]  + 2*k3[5]  + k4[5]);
        b12[i] = b12[i] + (h/6)*(k1[6]  + 2*k2[6]  + 2*k3[6]  + k4[6]);
        a13[i] = a13[i] + (h/6)*(k1[7]  + 2*k2[7]  + 2*k3[7]  + k4[7]);
        b13[i] = b13[i] + (h/6)*(k1[8]  + 2*k2[8]  + 2*k3[8]  + k4[8]);
        a14[i] = a14[i] + (h/6)*(k1[9]  + 2*k2[9]  + 2*k3[9]  + k4[9]);
        b14[i] = b14[i] + (h/6)*(k1[10] + 2*k2[10] + 2*k3[10] + k4[10]);
        a23[i] = a23[i] + (h/6)*(k1[11] + 2*k2[11] + 2*k3[11] + k4[11]);
        b23[i] = b23[i] + (h/6)*(k1[12] + 2*k2[12] + 2*k3[12] + k4[12]);
        a24[i] = a24[i] + (h/6)*(k1[13] + 2*k2[13] + 2*k3[13] + k4[13]);
        b24[i] = b24[i] + (h/6)*(k1[14] + 2*k2[14] + 2*k3[14] + k4[14]);
        a34[i] = a34[i] + (h/6)*(k1[15] + 2*k2[15] + 2*k3[15] + k4[15]);
        b34[i] = b34[i] + (h/6)*(k1[16] + 2*k2[16] + 2*k3[16] + k4[16]);
    
        t = t + h;        
    } */

    return rho11[i];
}).setOutput([N]);


//console.log(kernel(0.5, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0))


//escreverArquivo(path, dados)

//console.log(rho11)

console.log(kernel(rho11, rho22, rho33, rho44, a12, b12, a13, b13, a14, b14, a23, b23, a24, b24, a34, b34))