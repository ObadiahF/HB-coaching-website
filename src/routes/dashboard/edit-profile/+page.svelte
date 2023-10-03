<svelte:head>
    <title>HumbleBeast | Profile</title>
</svelte:head>

<script>
    import { colors } from "../../../utils/colors";
    import { dashState } from "../../../utils/store";
    import Edit from "../../../components/dashboard-components/edit.svelte";
let state;

$: {
    state = $dashState;
    if (state[1] === 'light-mode') {
            mainBackground = 'white';
            color = '#242529'
            activeColor = 'grey';
            checkedColor = '#242529';
            lineColor = '#D3D3D3';
        } else {
            mainBackground = '#242529';
            color = 'white'
            activeColor = '#353537';
            checkedColor = '#242529';
            lineColor = '#2c2d32';
        }
}


let mainBackground, color, activeColor, checkedColor, lineColor = { colors };

</script>

<Edit />

