const functions = require('./function.js');

function compareChangeToCommit() {
    const originalFilePath = './DB/変更後.txt';
    const originalTableData = functions.parseTableData(originalFilePath);

    const ChangeFilePath = './DB/コミット後.txt';
    const changeTableData = functions.parseTableData(ChangeFilePath);

    if (!functions.checkArray(originalTableData, changeTableData)) {
        console.log('データが一致しません');
        return;
    } 

    functions.checkArrayDifference(originalTableData, changeTableData);

    const csvPath = './変更後_コミット後_差分情報.csv';
    functions.exportDifferencesToCsv(originalTableData, changeTableData, csvPath);

}

compareChangeToCommit();

