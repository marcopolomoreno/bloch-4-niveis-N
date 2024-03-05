let A = 0.1,
    B = 0.1,
    delta21,
    delta31,
    delta41,
    delta32,
    delta42,
    delta43,
    gamma12,
    gamma13,
    gamma14,
    gamma23,
    gamma24,
    gamma34,
    alpha22,
    alpha44;

    

function bloch()
{
    if (j===1)  return 2*A*b12 + 0.5*alpha22*rho22 + 0.5*alpha44*rho44;

    if (j===2)  return -2*A*b12 + 2*B*b23 - alpha22*rho22;

    if (j===3)  return 2*A*b34 - 2*B*b23 + 0.5*alpha22*rho22 + 0.5*alpha44*rho44;

    if (j===4)  return -2*A*b34 - alpha44*rho44;

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
    if (j===16) return -gamma34*b34 + delta43*a34 + B*a24 - (rho44-rho33)*A;
}