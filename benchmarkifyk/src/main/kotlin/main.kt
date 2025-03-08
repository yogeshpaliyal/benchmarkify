import androidx.compose.runtime.*
import org.jetbrains.compose.web.dom.Button
import org.jetbrains.compose.web.dom.Div
import org.jetbrains.compose.web.dom.Text
import org.jetbrains.compose.web.renderComposable

fun main() {
    renderComposable(rootElementId = "root") {
        Body()
    }
}

@Composable
fun Body() {
    var counter by remember { mutableStateOf(0) }
    Div(attrs = {
        classes("text-lg", "px-[22]")
    }) {
        Text("Clicked: ${counter}")
    }
    Button(
        attrs = {
            classes("text-lg")
            onClick { _ ->
                counter++
            }
        }
    ) {
        Text("Click")
    }
}
