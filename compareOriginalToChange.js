const functions = require('./function.js');

function compareOriginalToChange() {
    const originalFilePath = './DB/変更前.txt';
    const originalTableData = functions.parseTableData(originalFilePath);

    const ChangeFilePath = './DB/変更後.txt';
    const changeTableData = functions.parseTableData(ChangeFilePath);

    if (!functions.checkArray(originalTableData, changeTableData)) {
        console.log('データが一致しません');
        return;
    } 

    functions.checkArrayDifference(originalTableData, changeTableData);

    const csvPath = './変更前_変更後_差分情報.csv';
    functions.exportDifferencesToCsv(originalTableData, changeTableData, csvPath);

}

compareOriginalToChange();

