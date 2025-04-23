const fs = require('fs');
const path = require('path');

// テキストファイルからテーブルのデータを配列として取得する巻子
function parseTableData(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    // 以下の処理で fileContent を使用
    const rows = fileContent.split('\n')
        .filter(row => row.trim() && !row.includes('+-')); // 区切り線を除外
    
    // ヘッダー行を取得
    const header = rows[0].split('|')
        .map(header => header.trim())
        .filter(header => header); // 空文字を除外

    // データ行を取得
    const records = [];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const record = row.split('|')
            .map(cell => cell.trim())

        records.push(record);
    }
    // 最初と最後の要素が空文字の場合、それらを削除
    records.forEach(record => {
        if (record[0] === '') {
            record.shift();
        }
        if (record[record.length - 1] === '') {
            record.pop(); 
        }
    });

    return {
        header: header,
        records: records
    };
}

// 配列のヘッダーと要素数が完全に一致するかチェック
function checkArray(ary1, ary2) {
    if (ary1.header.length !== ary2.header.length) {
        return false;
    }
    if (ary1.records.length !== ary2.records.length) {
        return false;
    }
    return true;
}

// データの差分をチェック
function checkArrayDifference(ary1, ary2) {
    // 各レコードの値を比較
    for (let i = 0; i < ary1.records.length; i++) {
        const record1 = ary1.records[i];
        const record2 = ary2.records[i];
        
        // レコードの各要素を比較
        for (let j = 0; j < record1.length; j++) {
            if (record1[j] !== record2[j]) {
                // 差分があった場合は以下の情報を出力
                console.log(`差分が見つかりました:`);
                console.log(`先頭のカラム情報: ${ary1.header[0]} : ${record1[0]}`);
                console.log(`カラム: ${ary1.header[j]}`);
                console.log(`変更前: ${record1[j]}`);
                console.log(`変更後: ${record2[j]}`);
                console.log('--------------------------------');
            }
        }
    }
    return true;
}

// CSVとして差分情報を保存する関数
function exportDifferencesToCsv(ary1, ary2, csvPath) {
    let targetPath = csvPath;
    let counter = 1;
    // 同じ名前のファイルが存在する場合、末尾に数字を追加してファイル名を変更
    while (fs.existsSync(targetPath)) {
        const parsed = path.parse(csvPath);
        targetPath = path.join(parsed.dir, `${parsed.name}${counter}${parsed.ext}`);
        counter++;
    }
    
    const csvRows = [];
    // CSVのヘッダー行を追加
    csvRows.push('先頭のカラム情報,カラム,変更前,変更後');

    let diffCount = 0; // 差分件数をカウント
    // 各レコードの比較
    for (let i = 0; i < ary1.records.length; i++) {
        const record1 = ary1.records[i];
        const record2 = ary2.records[i];

        // 各セルの比較
        for (let j = 0; j < record1.length; j++) {
            if (record1[j] !== record2[j]) {
                diffCount++;
                // 差分情報を作成（先頭のカラム情報は「ヘッダー名 : 先頭値」として出力）
                const rowData = [
                    `${ary1.header[0]} : ${record1[0]}`,
                    ary1.header[j],
                    record1[j],
                    record2[j]
                ];
                // セル内にカンマが含まれる可能性に備えて、各項目をダブルクオートで囲む
                const escapedRow = rowData.map(cell => `"${cell}"`);
                csvRows.push(escapedRow.join(','));
            }
        }
    }

    if (diffCount === 0) {
        console.log('差分は見つかりませんでした。CSVファイルは作成されません。');
        return;
    }

    // CSV内容を作成し、UTF-8 BOMを追加（Excelでの文字化け防止）
    const csvContent = "\uFEFF" + csvRows.join('\n');
    fs.writeFileSync(targetPath, csvContent, 'utf8');
    console.log(`CSVファイルとして差分を保存しました: ${targetPath}`);
}

module.exports = {
    parseTableData,
    checkArray,
    checkArrayDifference,
    exportDifferencesToCsv
};