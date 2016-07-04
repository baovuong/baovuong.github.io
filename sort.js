function roundedUp(i) {
    return (i+0.5)|0;
}

function roundedDown(i) {
    return (i-0.5)|0;
}

function stepDiff(current, previous) {
    // diff should have the following:
    // * array of new values in certain indexes
    // * whether that step is focused or not
    var diff = { 'changes': new Array() };

    // check for new values
    for (var i=0; i<current.values.length; i++) {
        if (current.values[i] != previous.values[i]) {
            diff.changes.push({'index': i, 'value': current.values[i]});
        }
    }

    // check if new focused value
    if ('focused' in current)
        diff.focused = current.focused;
    return diff;
}

function nextStep(current, next) {
    for (var i=0; i<next.changes.length; i++) {
        current.values[next.changes[i].index] = next.changes[i].value;
    }
    if ('focused' in next)
        current.focused = next.focused;
    else if ('focused' in current)
        delete current.focused;
}

function arrayToForm(array,paramName) {
    var result = "";
    for (var i=0; i<array.length; i++) {
        result += paramName + "=" + array[i];
        if (i < array.length-1)
            result += "&";
    }

    return result;
}

function selectionSort(arrayInput) {
    var frames = {};
    frames.initial = arrayInput.slice(0);
    frames.steps = new Array();
    var previous = {'values': frames.initial.slice(0)};

    var n = arrayInput.length;
    for (var j=0; j<n-1; j++) {
        var iMin = j;
        for (var i = j+1; i<n; i++) {
            frames.steps.push(stepDiff({'values': arrayInput.slice(0), 'focused': i}, previous));
            previous.values = arrayInput.slice(0);

            if (arrayInput[i] < arrayInput[iMin]) {
                iMin = i;
            }
        }
        if (iMin != j) {
            var temp = arrayInput[j];
            arrayInput[j] = arrayInput[iMin];
            arrayInput[iMin] = temp;
            frames.steps.push(stepDiff({'values': arrayInput.slice(0)}, previous));
            previous.values = arrayInput.slice(0);
        }
    }

    frames.steps.push(stepDiff({'values': arrayInput.slice(0)}, previous));
    return frames;
}

function insertionSort(arrayInput) {
    var frames = {};
    frames.initial = arrayInput.slice(0);
    frames.steps = new Array();
    var previous = frames.initial.slice(0);

    frames.steps.push(stepDiff({'values': arrayInput.slice(0)}, {'values': previous.slice(0)}));
    previous = arrayInput.slice(0);
    for (var i=0; i<arrayInput.length; i++) {
        var key = arrayInput[i];
        var j = i - 1;
        while (j >= 0 && arrayInput[j] > key) {
            frames.steps.push(stepDiff({'values': arrayInput.slice(0), 'focused': j}, {'values': previous.slice(0)}));
            previous = arrayInput.slice(0);

            arrayInput[j+1] = arrayInput[j];
            j = j-1;
            frames.steps.push(stepDiff({'values': arrayInput.slice(0)}, {'values': previous.slice(0)}));
            previous = arrayInput.slice(0);
        }
        arrayInput[j+1] = key;
        frames.steps.push(stepDiff({'values': arrayInput.slice(0)}, {'values': previous.slice(0)}));
        previous = arrayInput.slice(0);
    }
    frames.steps.push(stepDiff({'values': arrayInput.slice(0)}, {'values': previous.slice(0)}));
    return frames;
}

function merge(arr, l, m, r, frames, previous) {
    var n1 = m - l + 1;
    var n2 = r - m;

    var L = new Array();
    var R = new Array();
    for (var i = 0; i < n1; i++)
        L.push(arr[l + i]);
    for (var j = 0; j < n2; j++)
        R.push(arr[m + 1 + j]);

    var i = 0;
    var j = 0;
    var k = l;

    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        }
        else {
            arr[k] = R[j];
            j++;
        }
        frames.steps.push(stepDiff({'values': arr.slice(0), 'focused': k}, previous));
        previous.values = arr.slice(0);
        k++;
        frames.steps.push(stepDiff({'values': arr.slice(0)}, previous));
        //previous.values = arr.slice(0);
    }

    while (i < n1) {
        arr[k] = L[i];
        frames.steps.push(stepDiff({'values': arr.slice(0)}, previous));
        previous.values = arr.slice(0);
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        frames.steps.push(stepDiff({'values': arr.slice(0)}, previous));
        previous.values = arr.slice(0);
        j++;
        k++;
    }
    //steps.push({'values': arr.slice(0)});
    return frames;
}

function min(x,y) {
    return (x < y) ? x : y;
}

function mergeSort(arr, l=0, r=-1, frames=null, previous=null) {
    if (r == -1 && frames == null) {
        r = arr.length-1;
    }
    if (frames == null) {
        frames = {};
        frames.initial = arr.slice(0);
        frames.steps = new Array();
        previous = {'values': arr.slice(0)};
    }

    if (l < r) {
        var m = Math.floor(l + (r-l)/2);
        mergeSort(arr, l, m, frames, previous);
        mergeSort(arr, m+1, r, frames, previous);
        merge(arr, l, m, r, frames, previous);
    }
    return frames;
}

function partition(arr, l, h, frames, previous) {
    var x = arr[h];
    var i = l - 1;

    for (var j=l; j <= h-1; j++) {
        frames.steps.push(stepDiff({'values': arr.slice(0), 'focused': j}, previous));
        if (arr[j] <= x) {
            i++;
            // swap
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            frames.steps.push(stepDiff({'values': arr.slice(0)}, previous));
            previous.values = arr.slice(0);
        }
    }
    // swap
    var temp = arr[i+1];
    arr[i+1] = arr[h];
    arr[h] = temp;
    frames.steps.push(stepDiff({'values': arr.slice(0)}, previous));
    previous.values = arr.slice(0);
    return (i+1);
}

function quickSort(arr, l=0, h=-1, frames=null, previous=null) {
    if (h == -1 && frames == null) {
        h = arr.length-1;
    }
    if (frames == null) {
        frames = {};
        frames.initial = arr.slice(0);
        frames.steps = new Array();
        previous = {'values': arr.slice(0)};
    }

    if (l < h) {
        var p = partition(arr, l, h, frames, previous);
        quickSort(arr, l, p - 1, frames, previous);
        quickSort(arr, p + 1, h, frames, previous);
    }
    return frames;
}

function bubbleSort(arr) {
    var frames = {};
    frames.steps = new Array();
    frames.initial = arr.slice(0);
    var previous = {'values': arr.slice(0)};
    //steps.push({'values': arr.slice(0)});
    for (var i=0; i<arr.length-1; i++) {
        for (var j=0; j<arr.length-i-1; j++) {
            frames.steps.push(stepDiff({'values': arr.slice(0), 'focused': j}, previous));
            if (arr[j] > arr[j+1]) {
                // swap
                var temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
                frames.steps.push(stepDiff({'values': arr.slice(0)}, previous));
                previous.values = arr.slice(0);
            }
        }
    }
    frames.steps.push(stepDiff({'values': arr.slice(0)}, previous));
    return frames;
}

function countingSort(arr) {
    var frames = {};
    frames.steps = new Array();
    frames.intial = arr.slice(0);
    var previous = {'values': arr.slice(0)};

    var output = new Array(arr.length);
    var count = Array.apply(null, Array(arr.length-1)).map(Number.prototype.valueOf,0);

    for (var i=0; i < arr.length; i++) {
        count[arr[i]]++;
    }

    for (var i=1; i<=arr.length; i++) {
        count[i] += count[i-1];
        frames.steps.push(stepDiff({'values': count.slice(0)}, previous));
        previous = count.slice(0);
    }

    for (var i=0; i < arr.length; i++) {
        output[count[arr[i]]-1] = arr[i];
        --count[arr[i]];
        frames.steps.push({'values': output.slice(0)});
    }

    for (var i=0; i<arr.length; i++) {
        arr[i] = output[i];
    }

    return frames;
}

function shellSort(arr) {
    var frames = {};
    frames.initial = arr.slice(0);
    frames.steps = new Array();
    var previous = arr.slice(0);
    var n = arr.length;
    for (var gap=n >> 1; gap > 0; gap = gap >> 1) {
        for (var i = gap; i < n; i++) {
            var temp = arr[i];

            var j;
            for (j=i; j >= gap && arr[j-gap] > temp; j -= gap) {
                frames.steps.push(stepDiff({'values': arr.slice(0), 'focused': i-gap}, previous));
                arr[j] = arr[j - gap];
                frames.steps.push(stepDiff({'values': arr.slice(0)}, previous));
                previous = arr.slice(0);
            }

            arr[j] = temp;
            frames.steps.push(stepDiff({'values': arr.slice(0)}, previous));
            previous = arr.slice(0);
        }
    }
    frames.steps.push(stepDiff({'values': arr.slice(0)}, previous));
    return frames;
}
